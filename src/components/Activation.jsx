import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

const Activation = () => {
  const { token } = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!token) return;
    setTimeout(() => {
      var requestOptions = {
        method: "POST",
        redirect: "follow",
      };

      fetch(
        "http://localhost:8081/user/auth/activate?token=" + token,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.statusCode === 400) {
            alert(result.message);
          }
          history.push("/login");
        })
        .catch((error) => console.log("error", error));
    }, 3500);
  }, [token]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#f7f7f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Activating user...</h1>
        <p style={{ fontWeight: 200 }}>
          Please wait while we do the job for you
        </p>
      </div>
      <div className="loader-6">
        <span></span>
      </div>
    </div>
  );
};

export default Activation;
