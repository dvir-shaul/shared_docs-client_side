import React from "react";

const PersonalInfo = () => {
  return (
    <div className="personal-div">
      <div className={`img-div`}>
        <img
          src="https://i.insider.com/5dcc135ce94e86714253af21?width=1000&format=jpeg&auto=webp"
          alt="personal-img"
        />
      </div>
      <div className="name-div">
        <p>Robert Downey Jr.</p>
      </div>
    </div>
  );
};

export default PersonalInfo;
