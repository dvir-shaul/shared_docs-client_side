import { useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import { useGetTokenFromLocalStorage } from "../customHooks/useGetTokenFromLocalStorage";
import SharedFolder from "../general-components/SharedFolder";

const MainFolders = ({ activeMainFolder, setActiveMainFolder, setPath }) => {
  const [folders, setFolders] = useState([]);
  const history = useHistory();
  const token = useGetTokenFromLocalStorage();

  useEffect(() => {
    if (!token) {
      history.push("/login");
    }
  }, []);

  const handleMainFolderClick = (folder) => {
    if (activeMainFolder?.id === folder.id) setActiveMainFolder();
    else setActiveMainFolder(folder);
  };

  useEffect(() => {
    let requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    };

    fetch(`http://localhost:8081/file/getAll?parentFolderId=`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setFolders(result);
      })
      .catch((error) => console.log("error", error));
  }, [token]);

  return (
    <div className="folders-div" style={{ minWidth: "175px", width: "100%" }}>
      {folders.length > 0 &&
        folders.map((folder) => (
          <p
            key={folder.id}
            className={`folder ${
              activeMainFolder?.id === folder.id ? "active" : ""
            }`}
            onClick={() => handleMainFolderClick(folder)}
          >
            {folder.name.charAt(0).toUpperCase() + folder.name.slice(1)}
          </p>
        ))}
      <SharedFolder
        handleMainFolderClick={handleMainFolderClick}
        activeMainFolder={activeMainFolder}
        setActiveMainFolder={setActiveMainFolder}
      />
    </div>
  );
};

export default MainFolders;
