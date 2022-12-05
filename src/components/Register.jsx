import React, { useRef } from "react";
import { ReactComponent as Laptop } from "../man-use-laptop.svg";
import { useHistory } from "react-router-dom";

export const Register = ({ email, setEmail }) => {
  const history = useHistory();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const redirectToLogin = () => {
    setEmail(emailRef.current.value);
    history.push("/login");
  };

  const register = (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      alert("Make sure both password fields are the same");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(emailRef.current.value)) {
      alert("Make sure the email is valid");
      return;
    }

    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        name: nameRef.current.value,
      }),
    };

    fetch("http://localhost:8081/user/auth/register", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.statsCode !== 201) {
          alert(result.message);
          return;
        }
        redirectToLogin();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div
      className="signup-page"
      style={{
        backgroundImage: `linear-gradient(to right, #396ee3, #3f7afe, #396ee3)`,
      }}
    >
      <div className="signup-background-div">
        <div className="man-use-laptop">
          <Laptop />
        </div>
        <div className="already-registered">
          <p>Already a member?</p>
          <button onClick={redirectToLogin}>Login</button>
        </div>
      </div>

      <div className="signup-form">
        <div className="title">
          <h1>Create an account</h1>
          <p>Register for the most powerful online shared-document system</p>
        </div>
        <div>
          <form className="signup-inputs">
            <input ref={nameRef} required placeholder="Name" />
            <input
              ref={emailRef}
              required
              placeholder="Email"
              type="email"
              defaultValue={email}
            />
            <input
              ref={passwordRef}
              required
              placeholder="Password"
              type="password"
            />
            <input
              ref={confirmPasswordRef}
              required
              type="password"
              placeholder="Confirm password"
            />
            <div className="submit-div">
              <input
                onClick={register}
                type={"submit"}
                className="signup-submit-button"
                placeholder="Submit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
