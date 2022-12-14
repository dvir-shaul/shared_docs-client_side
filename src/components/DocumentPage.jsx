import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import ActiveUsers from "./ActiveUsers";
import TextEditor from "../TextEditor";
import downloadImg from "../downloadImg.png";
import { useParams } from "react-router-dom";
import Modal from "../general-components/Modal";
import { useGetTokenFromLocalStorage } from "../customHooks/useGetTokenFromLocalStorage";

const DocumentPage = ({
  activeMainFolder,
  setActiveDocument,
  activeDocument,
  setActiveMainFolder,
}) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [assignedUsersToDocument, setAssignedUsersToDocument] = useState([]);
  const { documentId, userId } = useParams();
  const [rerenderUsers, setRerenderUsers] = useState(false);
  const [path, setPath] = useState([]);
  const token = useGetTokenFromLocalStorage();

  useEffect(() => {
    if (documentId) {
      setPath({ id: -1 });
      setActiveMainFolder({
        id: -1,
        type: "FOLDER",
      });
      getDocument(documentId.split("=")[1]);
    }
  }, [documentId, userId]);

  const exportFile = () => {
    const fileData = document.querySelector(".ql-editor").innerText;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${activeDocument.name}.txt`;
    link.href = url;
    link.click();
  };

  const toggleModal = () => {
    const modal = document.querySelector(".modal-wrapper");
    if (modal.classList.contains("active")) modal.classList.remove("active");
    else modal.classList.add("active");
  };

  const getDocument = () => {
    if (documentId == null) return;
    // get document from database!
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "http://localhost:8081/file/document?documentId=" +
        documentId.split("=")[1],
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(
          "Looking for a document info because I used a copy link",
          result
        );
        if (result.statusCode !== 200) {
          alert(result.message);
          return;
        }
        setActiveDocument(result.data);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="folderContainer">
      <Modal
        activeDocument={activeDocument}
        toggleModal={toggleModal}
        onlineUsers={onlineUsers}
        setOnlineUsers={setOnlineUsers}
      />
      <div className="editorContainer">
        <Menu
          path={path}
          setPath={setPath}
          activeMainFolder={activeMainFolder}
          setActiveMainFolder={setActiveMainFolder}
          activeDocument={activeDocument}
          setActiveDocument={setActiveDocument}
        />
        {activeDocument && activeMainFolder && (
          <div className="textContainer">
            <div className="document-topping">
              <div className="active-download">
                <ActiveUsers
                  toggleModal={toggleModal}
                  activeDocument={activeDocument}
                  onlineUsers={onlineUsers}
                  setAssignedUsersToDocument={setAssignedUsersToDocument}
                  assignedUsersToDocument={assignedUsersToDocument}
                  setRerenderUsers={setRerenderUsers}
                  rerenderUsers={rerenderUsers}
                  setOnlineUsers={setOnlineUsers}
                />
                <div className="download-div" onClick={exportFile}>
                  <img
                    className="downloadImg"
                    src={downloadImg}
                    alt="download-file"
                  />
                  <p>Export</p>
                </div>
              </div>
              <div className="doc-title-name">
                <h2>{activeDocument.name || "This is a temp title"}</h2>
              </div>
            </div>
            <TextEditor
              rerenderUsers={rerenderUsers}
              activeDocument={activeDocument}
              setOnlineUsers={setOnlineUsers}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentPage;
