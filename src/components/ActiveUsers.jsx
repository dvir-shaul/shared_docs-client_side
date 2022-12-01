import { NameBubble } from "../general-components/NameBubble";
import copyImg from "../copyImg.png";
import linkImg from "../linkImg.png";
import invite2Img from "../invite2Img.png";
import { useGetTokenFromLocalStorage } from "../customHooks/useGetTokenFromLocalStorage.js";
import copy from "copy-to-clipboard";
import { useEffect } from "react";

const ActiveUsers = ({
  onlineUsers,
  setOnlineUsers,
  activeDocument,
  assignedUsersToDocument,
  setAssignedUsersToDocument,
  toggleModal,
}) => {
  const token = useGetTokenFromLocalStorage();
  const copyShareLink = () => {
    const link =
      "http://localhost:3000/document/share/documentId=" + activeDocument.id;
    copy(link);
    alert("copied share link to clipbaord");
  };

  const inviteUser = () => {
    const userEmail = prompt(
      "Include the user email you want to share this document with:"
    );
    if (userEmail === null) return;
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify([userEmail]);

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "http://localhost:8081/user/share?documentId=" + activeDocument.id,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setAssignedUsersToDocument(result);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="online-users">
      {(activeDocument.permission === "ADMIN" ||
        activeDocument.permission === "MODERATOR") && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img
            onClick={inviteUser}
            className="invite-img"
            src={invite2Img}
            alt="invite"
          />
          <img
            onClick={copyShareLink}
            className="invite-img"
            src={linkImg}
            alt="copy"
          />
        </div>
      )}
      {Object.values(onlineUsers).map((user, index) => (
        <NameBubble
          toggleModal={toggleModal}
          index={index}
          activeDocument={activeDocument}
          key={"user-bubble-" + user.email}
          user={user}
        />
      ))}
    </div>
  );
};

export default ActiveUsers;
