import { useState, useRef, useContext } from "react";
import Validation from "./Validation";
import classes from "./Login.module.css";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

const AuthForm = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory(); // use to redirect
  const userNameInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState(["", true]);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredUsername = userNameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation
    const user = {
      username: enteredUsername,
      password: enteredPassword,
    };
    setIsLoading(true);
    const msg = Validation(user);
    console.log(msg);

    if (!msg[1]) {
      setIsValid(false);
      setErrorMessage([msg[0], msg[1]]);
    } else {
      fetch("http://localhost:5000/login", {
        method: "POST",
        body: JSON.stringify({
          username: enteredUsername,
          password: enteredPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            setIsValid(true);
            console.log("Logged In!");
            return res.json();
          } else {
            return res.json().then((data) => {
              setIsValid(false);
              console.log(data);
              // throw error message
              throw new Error(data.message);
            });
          }
        })
        .then((data) => {
          // const expirationTime = new Date((new Date.))
          // set access_token to auth-context
          authCtx.login(data.access_token);
          history.replace("/profile");
        })
        .catch((err) => {
          msg[0] = err.message;
          setErrorMessage([msg[0], msg[1]]);
        });
    }

    setIsLoading(false);
  };

  return (
    <section className={classes.auth}>
      {!isValid && <p className={classes.failure}>{errorMessage[0]}</p>}
      <h1>Login</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" required ref={userNameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          ></button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
