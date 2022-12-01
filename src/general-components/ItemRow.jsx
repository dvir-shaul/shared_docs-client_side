import React from "react";
import fileImg from "../fileImg.png";
import folderImg from "../folderImg.png";
import renameImg from "../renameImg.png";
import deleteImg from "../deleteImg.png";
import { useGetTokenFromLocalStorage } from "../customHooks/useGetTokenFromLocalStorage";

const ItemRow = ({
  item,
  callBack,
  selectedFile,
  fetchContent,
  path,
  activeDocument,
  setActiveDocument,
  activeMainFolder,
}) => {
  const token = useGetTokenFromLocalStorage();
  const deleteConfirm = (item) => {
    let text = `Are you sure you want to delete ${item.name}?\nBy confirm, it will be permanently removed and will not be recoverable.`;
    if (item.type === "FOLDER") {
      text +=
        "\nFor your information, all the content within this folder will be removed as well.";
    }
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(text)) return;
    deleteFile(item);
  };
  const renameConfirm = (item) => {
    let text = `Are you sure you want to rename ${item.name}?\nBy confirm, the change will not be reversible.`;
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(text)) return;
    const newName = prompt("What will be the new name?");
    if (newName == null) return;
    renameFile(item, newName);
  };

  const deleteFile = (file) => {
    alert("This file will be deleted!");

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      id: file.id,
    });

    let requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8081/file/${file.type.toLowerCase()}?${file.type.toLowerCase()}Id=${
        file.id
      }`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        if (file.id === activeDocument.id) setActiveDocument(null);
        fetchContent(path[path.length - 1].id);
      })
      .catch((error) => console.log("error", error));
  };

  const renameFile = (file, newName) => {
    alert("Name has been changed to -> " + newName);
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    // let raw = JSON.stringify({
    //   id: file.id,
    //   name: newName,
    // });

    let requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      // body: raw,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8081/file/${file.type.toLowerCase()}/rename?${file.type.toLowerCase()}Id=${
        file.id
      }&name=${newName}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        const tempDoc = { ...activeDocument };
        tempDoc.name = newName;
        setActiveDocument(tempDoc);
        fetchContent(path[path.length - 1].id);
      })
      .catch((error) => console.log("error", error));
  };

  console.log(item);

  return (
    <div
      data-id={item.id}
      className={`file ${
        selectedFile === item.id && item.type === "DOCUMENT" && "active"
      }`}
    >
      <div
        onClick={() => callBack(item)}
        data-id={item.id}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {item.type === "DOCUMENT" && (
          <img
            data-id={item.id}
            className={`documentImg ${selectedFile && "active"}`}
            src={fileImg}
            alt="doc"
          />
        )}
        {item.type === "FOLDER" && (
          <img
            data-id={item.id}
            className={`folderImg ${selectedFile && "active"}`}
            src={folderImg}
            alt="doc"
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            onClick={() => callBack(item)}
            className={`file-name-paragraph ${selectedFile && "active"}`}
            data-id={item.id}
          >
            {item.name}
            {item.type === "DOCUMENT" && (
              <span
                data-id={item.id}
                style={{
                  fontSize: selectedFile ? "12px" : "10px",
                  fontWeight: 100,
                }}
              >
                .txt
              </span>
            )}
          </p>
          {activeMainFolder.id === -1 && (
            <p style={{ fontSize: "10px" }}>{item.adminEmail}</p>
          )}
        </div>
      </div>

      {activeMainFolder.id !== -1 && (
        <div className={`edits-div ${selectedFile && "active"}`}>
          <img
            onClick={() => renameConfirm(item)}
            src={renameImg}
            alt="rename file"
          />
          <img
            onClick={() => deleteConfirm(item)}
            src={deleteImg}
            alt="delete file"
          />
        </div>
      )}
    </div>
  );
};

export default ItemRow;
