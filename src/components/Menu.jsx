import React from "react";
const Menu = () => {
  return (
    <div className="menu">
      <div
        className="menu-folder"
        style={{
          backgroundImage: `linear-gradient(to right, #396EE3, #3F7AFE, #396EE3)`,
        }}
      >
        <div className="personal-div">
          <div className="img-div">
            <img
              src="https://i.insider.com/5dcc135ce94e86714253af21?width=1000&format=jpeg&auto=webp"
              alt="personal-img"
            />
          </div>
          <div className="name-div">
            <p>Robert Downey Jr.</p>
          </div>
        </div>
        <div className="search">
          <input placeholder="Search folders..." />
        </div>
        <div className="folders-div">
          <p className="folder">Business</p>
          <p className="folder">Design</p>
          <p className="folder">General</p>
          <p className="folder">Journal</p>
          <p className="folder">Personal</p>
          <p className="folder">Programming</p>
        </div>
      </div>
      {/* <div className="menu-document"></div> */}
    </div>
  );
};
export default Menu;