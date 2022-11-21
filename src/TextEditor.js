import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { over } from "stompjs";
import SockJS from "sockjs-client";

let stompClient;
let quill;

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  // [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  // [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  // ["image", "blockquote", "code-block"],
  // ["clean"],
];

export default function TextEditor() {
  const { id: documentId } = useParams();
  const [content, setContent] = useState("");
  const [socket, setSocket] = useState();

  useEffect(() => {
    connect();
    return () => {
      stompClient.disconnect();
    };
  }, []);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, (error) => {
      console.log("THIS DIDN'T WORK!" + error);
    });
  };
  const onConnected = () => {
    quill.enable();
    quill.setText(""); // bring all content from the specific document
    stompClient.subscribe("/document", onContentReceived);
    // userJoin();
  };

  const onContentReceived = (payload) => {
    const payloadData = JSON.parse(payload?.body);

    // switch(payloadData.status){
    //     case "JOIN":
    //         if(!privateChats.get(payloadData.senderName)){
    //             privateChats.set(payloadData.senderName,[]);
    //             setPrivateChats(new Map(privateChats));
    //         }
    //         break;
    //     case "MESSAGE":
    //         publicChats.push(payloadData);
    //         setPublicChats([...publicChats]);
    //         break;
    // }

    quill.enable();
    console.log(payloadData.content);
    quill.setText(payloadData.content);
  };

  const createRequest = (delta) => {
    let textChange = {
      userId: 1,
      documentId: 4,
    };

    if (!delta.ops[1]) {
      textChange.offset = 0;
      textChange.data = Object.values(delta?.ops?.[0])[0];
      if (delta.ops[0].insert) {
        textChange.action = "insert";
      } else if (delta.ops[0].delete) {
        textChange.action = "delete";
      }
    } else {
      textChange.offset = delta?.ops?.[0]?.retain;
      textChange.data = Object.values(delta?.ops?.[1])[0];
      if (delta.ops[1].insert) {
        textChange.action = "insert";
      } else if (delta.ops[1].delete) {
        textChange.action = "delete";
      }
    }
    return textChange;
  };

  // useEffect(() => {
  //   if (socket == null || quill == null) return;

  //   socket.once("load-document", (document) => {
  //     quill.setContents(document);
  //     quill.enable();
  //   });

  //   // socket.emit("get-document", documentId);
  // }, [socket, quill, documentId]);

  // useEffect(() => {
  //   if (socket == null || quill == null) return;

  //   const interval = setInterval(() => {
  //     socket.emit("save-document", quill.getContents());
  //   }, SAVE_INTERVAL_MS);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [socket, quill]);

  // useEffect(() => {
  //   if (socket == null || quill == null) return;

  //   const handler = (delta) => {
  //     quill.updateContents(delta);
  //   };
  //   socket.on("receive-changes", handler);

  //   return () => {
  //     socket.off("receive-changes", handler);
  //   };
  // }, [socket, quill]);

  useEffect(() => {
    if (quill == null) return;

    const textChangeHandler = (delta, oldDelta, source) => {
      if (!stompClient || source !== "user") return;
      const textChange = createRequest(delta);
      stompClient.send("/app/document", {}, JSON.stringify(textChange));

      // setUserData({ ...userData, message: "" });
      // socket.emit("send-changes", delta);
    };
    quill.on("text-change", textChangeHandler);

    return () => {
      quill.off("text-change", textChangeHandler);
    };
  }, [stompClient, quill]);

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
