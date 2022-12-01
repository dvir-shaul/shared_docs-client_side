import { useEffect } from "react";
import { useGetTokenFromLocalStorage } from "../customHooks/useGetTokenFromLocalStorage";

const Modal = ({ onlineUsers, toggleModal, activeDocument }) => {
  const permissionsArray = ["VIEWER", "EDITOR", "MODERATOR"];
  const token = useGetTokenFromLocalStorage();

  const changePermissionToUser = (user, permission) => {
    console.log(user);
    console.log(permission);
    console.log(activeDocument);

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `http://localhost:8081/user/permission/give?documentId=${activeDocument.id}&uid=${user.id}&permission=${permission}`;
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="modal-wrapper">
      <div className="modal">
        <p onClick={toggleModal} className="close-modal-button">
          &times;
        </p>
        <h3>Manage Permission</h3>
        <div className="users-list">
          {Object.values(onlineUsers).map((user, index) => {
            if (user.permission === "ADMIN") return null;
            return (
              <div key={index} className="user-in-list">
                <p style={{ width: "15%" }}>{user.name}</p>
                <p style={{ width: "40%" }}>{user.email}</p>
                <select
                  defaultValue={user.permission}
                  onChange={(e) => changePermissionToUser(user, e.target.value)}
                  style={{ width: "20%" }}
                >
                  {permissionsArray.map((perm, index) => (
                    <option key={index} value={perm}>
                      {perm}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Modal;
