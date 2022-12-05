import { useGetTokenFromLocalStorage } from "../customHooks/useGetTokenFromLocalStorage";
import closeImg from "../closeImg.png";

const Modal = ({
  onlineUsers,
  toggleModal,
  activeDocument,
  setOnlineUsers,
}) => {
  const permissionsArray = ["VIEWER", "EDITOR", "MODERATOR"];
  const token = useGetTokenFromLocalStorage();

  const changePermissionToUser = (user, permission) => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `http://localhost:8081/user/permission/give?documentId=${activeDocument.id}&uid=${user.id}&permission=${permission}`;
    console.log(url);
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("Changed permission to user. New list is: ", result.data);
        if (result.statusCode !== 200) {
          alert(result.message);
          return;
        }
        setOnlineUsers(result.data);
      })
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
          {Object.values(onlineUsers).length <= 1 ? (
            <p>Empty list</p>
          ) : (
            Object.values(onlineUsers).map((user, index) => {
              if (user.permission === "ADMIN") return null;
              return (
                <div key={index} className="user-in-list">
                  <div
                    style={{
                      width: "10%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      style={{
                        height: "23px",
                        cursor: "pointer",
                      }}
                      src={closeImg}
                      alt="close-button"
                      onClick={() =>
                        changePermissionToUser(user, "UNAUTHORIZED")
                      }
                    />
                  </div>
                  <p style={{ width: "15%" }}>{user.name}</p>
                  <p style={{ width: "40%" }}>{user.email}</p>
                  <select
                    defaultValue={user.permission}
                    onChange={(e) =>
                      changePermissionToUser(user, e.target.value)
                    }
                    style={{ width: "25%" }}
                  >
                    {permissionsArray.map((perm, index) => (
                      <option key={index} value={perm}>
                        {perm}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
