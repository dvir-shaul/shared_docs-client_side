import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useGetTokenFromLocalStorage } from "./customHooks/useGetTokenFromLocalStorage";

let stompClient;
let quill;
let userId;

const TOOLBAR_OPTIONS = [
  // [{ header: [1, 2, 3, 4, 5, 6, false] }],
  // [{ font: [] }],
  // [{ list: "ordered" }, { list: "bullet" }],
  // ["bold", "italic", "underline"],
  // [{ color: [] }, { background: [] }],
  // [{ script: "sub" }, { script: "super" }],
  // [{ align: [] }],
  // ["image", "blockquote", "code-block"],
  // ["clean"],
];

export default function TextEditor({
  activeDocument,
  setOnlineUsers,
  rerenderUsers,
}) {
  const [user, setUser] = useState();
  const token = useGetTokenFromLocalStorage();

  useEffect(() => {
    connect();
    return () => {
      console.log(">>>>>>>> Disconnecting!!!!");
      // first, leave the doc
      // if (stompClient.status !== "CONNECTED") return;
      stompClient.send(
        "/app/document/onlineUsers/" + activeDocument.id,
        {},
        JSON.stringify({
          userId,
          method: "REMOVE",
        })
      );
      stompClient.disconnect();
    };
  }, [activeDocument]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8081/ws");
    stompClient = over(Sock);
    stompClient.debug = null;
    stompClient.connect({}, onConnected, (error) => {
      console.log("THIS DIDN'T WORK!" + error);
    });

    // create fetch api call to update online field on user per document
  };

  const subscribeFunctions = () => {
    const documentId = activeDocument.id;
    // get all logs from other users
    stompClient.subscribe(`/document/${documentId}`, onContentReceived);
    // get all users + online users from the server
    stompClient.subscribe(
      `/document/onlineUsers/${documentId}`,
      onActiveUsersChange
    );
  };

  const getUser = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const url =
      "http://localhost:8081/user/document/getUser?documentId=" +
      activeDocument.id;

    console.log(url);

    return await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("The current user who watches the document:", result);
        setUser(result.data);
        userId = result.data.userId;
        return result.data;
      })
      .catch((error) => console.log("error", error));
  };

  const getContent = async () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const url =
      "http://localhost:8081/file/document/getContent?documentId=" +
      activeDocument.id;

    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Document's content is:", result);
        quill.setText(result.data);
      })
      .catch((error) => console.log("error", error));
  };

  const userPermissionsInDocument = async (connectedUser) => {
    if (!connectedUser?.permission) return;
    if (
      connectedUser?.permission === "VIEWER" ||
      connectedUser?.permission === "UNAUTHORIZED"
    )
      quill.disable();
    else quill.enable();

    if (connectedUser?.permission === "UNAUTHORIZED") {
      if (
        !document.querySelector(".textContainer").classList.contains("blur")
      ) {
        document.querySelector(".textContainer").classList.add("blur");
      }
    } else {
      document.querySelector(".textContainer").classList.remove("blur");
    }
  };

  const startRelationWithDocument = async () => {
    // get the user id and permission -> user object
    const connectedUser = await getUser();
    // get the content
    await getContent();
    // if the user is not allowed to edit text (viewer), quill.disabled().
    await userPermissionsInDocument(connectedUser);
    // else quill.enabled()
    return connectedUser;
  };

  const joinDocument = (connectedUser) => {
    console.log(connectedUser, userId);
    // tell everyone that I have entered the document and add me to the online users list
    stompClient.send(
      "/app/document/onlineUsers/" + activeDocument.id,
      {},
      JSON.stringify({
        userId: connectedUser?.userId || userId,
        method: "ADD",
      })
    );
  };

  useEffect(() => {
    if (stompClient.status !== "CONNECTED") return;
    console.log("re-fetching all users");
    joinDocument(userId);
  }, [rerenderUsers]);

  const onConnected = async () => {
    // get all necessary content -> join to doc + current content
    const connectedUser = await startRelationWithDocument();

    // listen to changes via subscribes -> log changes + online users changes
    subscribeFunctions();

    // tell everyone that i have joined the document
    joinDocument(connectedUser);
  };

  const onActiveUsersChange = async (payload) => {
    const usersObject = JSON.parse(payload.body);
    console.log("Got new list of active users:", usersObject);
    setOnlineUsers(usersObject);
  };

  const onContentReceived = (payload) => {
    const payloadData = JSON.parse(payload?.body);
    if (userId === payloadData.userId) return;

    if (payloadData.action.toLowerCase() === "delete") {
      quill.deleteText(payloadData.offset, parseInt(payloadData.data));
    } else if (payloadData.action.toLowerCase() === "insert") {
      quill.insertText(payloadData.offset, payloadData.data);
    }
  };

  const createRequest = (delta) => {
    let log = {
      userId: user.userId,
      documentId: activeDocument.id,
    };

    if (!delta.ops[1]) {
      log.offset = 0;
      log.data = Object.values(delta?.ops?.[0])[0];
      if (delta.ops[0].insert) {
        log.action = "insert";
      } else if (delta.ops[0].delete) {
        log.action = "delete";
      }
    } else {
      log.offset = delta?.ops?.[0]?.retain;
      log.data = Object.values(delta?.ops?.[1])[0];
      if (delta.ops[1].insert) {
        log.action = "insert";
      } else if (delta.ops[1].delete) {
        log.action = "delete";
      }
    }
    return log;
  };

  useEffect(() => {
    if (quill == null) return;
    const textChangeHandler = (delta, oldDelta, source) => {
      if (!stompClient || source !== "user") return;
      const log = createRequest(delta);
      stompClient.send(
        "/app/document/" + activeDocument.id,
        {},
        JSON.stringify(log)
      );
    };
    quill.on("text-change", textChangeHandler);

    return () => {
      quill.off("text-change", textChangeHandler);
    };
  });

  // useEffect(() => {
  //   if (quill == null) return;
  //   const userTextSelection = (range) => {
  //     if (range) {
  //       console.log(range);
  //     }
  //     //   if (!stompClient || source !== "user") return;
  //     //   const log = createRequest(delta);
  //     //   stompClient.send(
  //     //     "/app/document/" + activeDocument.id,
  //     //     {},
  //     //     JSON.stringify(log)
  //     //   );
  //   };
  //   quill.on("selection-change", userTextSelection);

  //   return () => {
  //     quill.off("selection-change-change", userTextSelection);
  //   };
  // });

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    quill = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    quill.disable();
    quill.setText("Loading...");
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
}
