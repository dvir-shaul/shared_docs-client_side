import React, { useEffect, useRef, useState } from "react";
import { useGetTokenFromLocalStorage } from "../customHooks/useGetTokenFromLocalStorage";
import ItemRow from "../general-components/ItemRow";
import plusImg from "../plusImg.png";
import fileImg from "../fileImg.png";
import folderImg from "../folderImg.png";

const FolderContent = ({
  activeMainFolder,
  setActiveDocument,
  activeDocument,
  path,
  setPath,
}) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const token = useGetTokenFromLocalStorage();

  useEffect(() => {
    if (!activeMainFolder) return;
    // fetchContent(activeMainFolder?.id);
    fetchFolderContent(activeMainFolder);
  }, [activeMainFolder]);

  const fetchFolderContent = (item) => {
    setSelectedFile(item.id);
    if (item.type === "FOLDER") fetchContent(item.id);
    else if (item.type === "DOCUMENT") setActiveDocument(item);

    if (item.id !== -1) fetchPath(item);
    else setPath([{ name: "Shared Documents" }]);
  };

  const getSharedContent = () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:8081/user/sharedDocuments", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setFiles(result);
      })
      .catch((error) => console.log("error", error));
  };

  const getPersonalContent = (id) => {
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    fetch(
      `http://localhost:8081/file/getAll?parentFolderId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setFiles(result);
      })
      .catch((error) => console.log("error", error));
  };

  const fetchContent = (id) => {
    if (id === -1) getSharedContent();
    else getPersonalContent(id);
  };

  const fetchPath = (item) => {
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };
    const url = `http://localhost:8081/file/getPath?type=${item.type}&fileId=${item.id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setPath(result);
        scrollRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      })
      .catch((error) => console.log("error", error));
  };

  const createNew = (type) => {
    const name = prompt("What would be the name of the new " + type + "?");
    if (name === null) return;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    // var raw = JSON.stringify({
    //   name,
    //   parentFolderId: path[path.length - 1].id,
    // });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      // body: raw,
      redirect: "follow",
    };
    const url = `http://localhost:8081/file/${type}?parentFolderId=${
      path[path.length - 1].id
    }&name=${name}`;

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => fetchContent(path[path.length - 1].id))
      .catch((error) => console.log("error", error));
  };

  const scrollRef = useRef();

  const checkFileValidation = (file) => {
    if (file.type !== "text/plain") {
      alert("A file must has to be use plain text format (e.g. .txt)");
      return false;
    }
    if (file.size > 1000) {
      alert("A file can not be heavier than 1MB");
      return false;
    }
    return true;
  };

  const uploadFileToDb = (name, content) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: content,
      redirect: "follow",
    };

    let url = `http://localhost:8081/file/document?parentFolderId=${
      path[path.length - 1].id
    }&name=${name}`;

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => fetchContent(path[path.length - 1].id))
      .catch((error) => console.log("error", error));
  };

  const changeHandler = async (event) => {
    console.log("in upload");
    if (!checkFileValidation(event.target.files[0])) {
      setUploadedFile(null);
      setIsFilePicked(false);
      return;
    }
    // import a file only if the file has been picked correctly
    setUploadedFile(event.target.files[0]);
    setIsFilePicked(true);

    const name = event.target.files[0].name.replace(".txt", "").trim();

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      // eslint-disable-next-line no-restricted-globals
      const isConfirmed = confirm(
        "Is this the file you wanted to upload?\n\n\tname:\n " +
          name +
          "\n\n\tcontent:\n" +
          text
      );
      if (isConfirmed) uploadFileToDb(name, text);
    };
    reader.readAsText(event.target.files[0]);
  };

  return (
    <div className="menu-document">
      {path.length > 0 && activeMainFolder.id !== -1 && (
        <>
          <div>
            Path:
            <hr></hr>
          </div>
          <div className="folder-path">
            {path.length > 0 &&
              path.map((item, index) => (
                <div className="path-div" key={index}>
                  <p
                    className="path-item"
                    onClick={() => fetchFolderContent(item)}
                  >
                    {item.name}
                  </p>
                  {index !== path.length - 1 && (
                    <p className="path-divider"> {">"}</p>
                  )}
                </div>
              ))}
            <div ref={scrollRef}></div>
          </div>
        </>
      )}
      {activeMainFolder.id !== -1 && (
        <div className="upload-div">
          <img src={plusImg} alt="upload-button" />
          <input type="file" name="file" onChange={changeHandler} />
          <p>Upload file</p>
        </div>
      )}
      <div className="folder-content">
        {activeMainFolder.id !== -1 && (
          <div className="create-new">
            <p>Create new:</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                gap: "10px",
              }}
            >
              <div className="new" onClick={() => createNew("document")}>
                <img src={fileImg} />
              </div>
              <div className="new" onClick={() => createNew("folder")}>
                <img src={folderImg} />
              </div>
            </div>
          </div>
        )}
        {files.length > 0 ? (
          files.map((file) => (
            <ItemRow
              setActiveDocument={setActiveDocument}
              activeDocument={activeDocument}
              activeMainFolder={activeMainFolder}
              fetchContent={fetchContent}
              path={path}
              key={file.id}
              item={file}
              callBack={fetchFolderContent}
              selectedFile={selectedFile}
            />
          ))
        ) : (
          <div>
            <p style={{ fontWeight: 200 }}>This folder is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderContent;
