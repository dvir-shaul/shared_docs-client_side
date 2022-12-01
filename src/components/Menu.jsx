import FolderContent from "./FolderContent";
import MainFolders from "./MainFolders";
import PersonalInfo from "./PersonalInfo";
import { useGetTokenFromLocalStorage } from "../customHooks/useGetTokenFromLocalStorage.js";
import { Redirect, useHistory } from "react-router-dom";
import { useState } from "react";
// import { useParams } from "react-router-dom";

const Menu = ({
  activeMainFolder,
  setActiveMainFolder,
  activeDocument,
  setActiveDocument,
  setPath,
  path,
}) => {
  // bring params from url
  // if shared -> setactivefolder to shared documents folder
  // setactivedocument to the id of the params
  useGetTokenFromLocalStorage();
  const history = useHistory();

  const logout = () => {
    console.log("logging out!");
    localStorage.removeItem("token");
    history.push("/login");
  };

  return (
    <div className={`menu ${activeDocument != null && "active"}`}>
      <div
        className={`menu-folder ${activeMainFolder != null && "active"}`}
        style={{
          backgroundImage: `linear-gradient(to right, #396ee3, #3f7afe, #396ee3)`,
        }}
      >
        <PersonalInfo />

        <MainFolders
          setPath={setPath}
          activeMainFolder={activeMainFolder}
          setActiveMainFolder={setActiveMainFolder}
        />
        <div className="log-out-div" onClick={logout}>
          <button className="log-out">Sign out</button>
        </div>
      </div>
      {activeMainFolder && activeMainFolder !== "" && (
        <FolderContent
          activeDocument={activeDocument}
          path={path}
          setPath={setPath}
          activeMainFolder={activeMainFolder}
          setActiveDocument={setActiveDocument}
        />
      )}
    </div>
  );
};

export default Menu;
