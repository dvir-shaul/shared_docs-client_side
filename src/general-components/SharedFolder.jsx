import React from "react";

const SharedFolder = ({ handleMainFolderClick, activeMainFolder }) => {
  return (
    <div
      onClick={() =>
        handleMainFolderClick({
          id: -1,
          type: "FOLDER",
          name: "Shared Documents",
        })
      }
      className={`folder ${activeMainFolder?.id === -1 ? "active" : ""}`}
    >
      Shared Documents
    </div>
  );
};

export default SharedFolder;
