import { useState, useRef } from "react";
import Validation from "./Validation";
import classes from "./Register.module.css";
import { useHistory } from "react-router-dom";

const AuthForm = () => {
  const history = useHistory();
  const userNameInputRef = useRef();
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState(["", true]);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredUsername = userNameInputRef.current.value;
    const enteredFirstName = firstNameInputRef.current.value;
    const enteredLastName = lastNameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation
    const user = {
      username: enteredUsername,
      firstName: enteredFirstName,
      lastName: enteredLastName,
      password: enteredPassword,
      email: enteredEmail,
    };
    setIsLoading(true);
    const msg = Validation(user);
    console.log(msg);
    if (!msg[1]) {
      setIsValid(false);
      setErrorMessage([msg[0], msg[1]]);
    } else {
      fetch("http://localhost:5000/register", {
        method: "POST",
        body: JSON.stringify({
          username: enteredUsername,
          first_name: enteredFirstName,
          last_name: enteredLastName,
          email: enteredEmail,
          password: enteredPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            setIsValid(true);
            return res.json();
          } else {
            return res.json().then((data) => {
              setIsValid(false);
              // show an error modal
              if (data && data.message) {
                setErrorMessage([data.message, false]);
              }
            });
          }
        })
        .then((data) => {
          console.log(data);
          history.replace("/login");
        });
    }

    setIsLoading(false);
  };

  return (
    <section className={classes.auth}>
      {!isValid && <p className={classes.failure}>{errorMessage[0]}</p>}
      <h1>Sign Up</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" required ref={userNameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="first-name">First Name</label>
          <input type="text" id="first-name" required ref={firstNameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="last-name">Last Name</label>
          <input type="text" id="last-name" required ref={lastNameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
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
          {!isLoading && <button>Create Account</button>}
          {isLoading && <p>Sending request...</p>}
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
