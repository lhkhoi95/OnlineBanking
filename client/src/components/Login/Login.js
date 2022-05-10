import { useState, useRef, useContext } from "react";
import Validation from "./Validation";
import "./Login.css";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";
import Login from "./images/login.png";
import RingLoader from "react-spinners/RingLoader";

const AuthForm = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory(); // use to redirect
  const userNameInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(["", true]);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredUsername = userNameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation
    const user = {
      username: enteredUsername,
      password: enteredPassword,
    };

    const msg = Validation(user);
    // console.log(msg);

    if (!msg[1]) {
      setErrorMessage([msg[0], msg[1]]);
    } else {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            body: JSON.stringify({
              username: enteredUsername,
              password: enteredPassword,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          // console.log(data);

          if (!response.ok) {
            setErrorMessage(data.message);
            throw new Error(data.message);
          }
          setIsValid(true);
          // set access_token to auth-context
          authCtx.login(data.access_token);
          history.replace("/profile");
        } catch (error) {
          setIsValid(false);
          msg[0] = error.message;
          setErrorMessage([msg[0], msg[1]]);
        }
      };
      fetchData();
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <section className="auth">
      {!isValid && !isLoading ? (
        <p className="failure">{errorMessage[0]}</p>
      ) : (
        <p className="failure"></p>
      )}
      <div className="text-center">
        <img className="img-thumbnail" src={Login}></img>
        <h1>Login</h1>
        <form onSubmit={submitHandler}>
          <div className="control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              autoFocus={true}
              placeholder="6-25 characters"
              required
              ref={userNameInputRef}
            />
          </div>
          <div className="control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="6-25 characters"
              required
              ref={passwordInputRef}
            />
          </div>
          <div className="actions">
            {!isLoading && <button className="btn-primary">Login</button>}
            {isLoading && <RingLoader size="32px" color="grey" />}
          </div>
        </form>
      </div>
    </section>
  );
};

export default AuthForm;
