import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";

export const NameBubble = ({ user, activeDocument, index, toggleModal }) => {
  const [userPicture, setUserPicture] = useState();

  const randomInt = () => {
    return Math.floor(Math.random() * (5 - 99 + 1) + 5);
  };

  useEffect(() => {
    fetch(`https://fakeface.rest/face/json?minimum_age=${randomInt()}`)
      .then((response) => response.json())
      .then((response) => {
        setUserPicture(response);
      });
  }, [activeDocument]);

  const handleModalOpen = () => {
    if (
      activeDocument.permission === "ADMIN" ||
      activeDocument.permission === "MODERATOR"
    ) {
      console.log("a user can open this modal!");
      toggleModal();
    }
  };

  return (
    <>
      <ReactTooltip
        effect="solid"
        type="light"
        place="bottom"
        padding="5px 10px"
        border
        multiline
        // backgroundColor="rgb(125 154 221)"
        textColor="black"
      />
      <div
        onClick={handleModalOpen}
        className={`bubble-wrapper ${user.status === "online" && "online"}`}
        style={{ transform: `translateX(-${index * 10}px)` }}
      >
        <div
          data-tip={
            user.name[0].toUpperCase() +
            user.name.slice(1) +
            "<br />" +
            user.email
          }
          // data-tip={name.charAt(0).toUpperCase() + name.slice(1)}
          className="online-user-bubble"
        >
          {userPicture && (
            <img src={userPicture?.image_url} alt="random-person" />
          )}
        </div>
      </div>
    </>
  );
};
