import React, { useEffect, useState } from "react";
import { useGetTokenFromLocalStorage } from "../customHooks/useGetTokenFromLocalStorage";

const PersonalInfo = () => {
  const [user, setUser] = useState();
  const token = useGetTokenFromLocalStorage();

  useEffect(() => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token);

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const url = "http://localhost:8081/user/getUser";
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("User info:", result);
        if (result.statusCode !== 200) {
          alert(result.message + "\nPlease try to refresh!");
          return;
        }
        setUser(result.data);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <div className="personal-div">
      <div className={`img-div`}>
        <img
          src="https://i.insider.com/5dcc135ce94e86714253af21?width=1000&format=jpeg&auto=webp"
          alt="personal-img"
        />
      </div>
      <div className="name-div">
        <p>{user?.name}</p>
        <p>{user?.email}</p>
      </div>
    </div>
  );
};

export default PersonalInfo;
