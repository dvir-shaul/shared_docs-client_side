import React, { useRef } from "react";
import { useHistory } from "react-router-dom";

export const Login = ({ email, setEmail }) => {
  const history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();

  const redirectToRegister = () => {
    setEmail(emailRef.current.value);
    history.push("/register");
  };

  const login = (e) => {
    e.preventDefault();

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      }),
    };

    fetch("http://localhost:8081/user/auth/login", requestOptions)
      .then((response) => response.text())
      .then((response) => {
        const token = response.replace("token:", "").trim();
        if (!token.includes("approve")) {
          localStorage.setItem("token", token);
          history.push("/document");
        } else {
          alert(
            "Could not log you in, try again later or change the credentials"
          );
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div
      className="signup-page"
      style={{
        backgroundImage: `linear-gradient(to right, #396ee3, #3f7afe, #396ee3)`,
      }}
    >
      <div className="login-background-div">
        <h1>Login</h1>
        <form className="login-inputs">
          <input
            required
            ref={emailRef}
            type="email"
            placeholder="Email"
            defaultValue={email}
          />
          <input
            required
            ref={passwordRef}
            placeholder="Password"
            type="password"
          />
          <input
            type={"submit"}
            onClick={login}
            className="login-button login"
          />
        </form>
        <div className="dont-have-account">
          <p>Don't have an account?</p>
          <button
            onClick={redirectToRegister}
            className="login-button register"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};
