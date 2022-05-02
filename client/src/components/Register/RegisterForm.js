import { useState, useRef } from "react";
import Validation from "./Validation";
import { useHistory } from "react-router-dom";
import "./RegisterForm.css";
import FadedLoader from "react-spinners/FadeLoader";

const AuthForm = () => {
  const history = useHistory();
  const userNameInputRef = useRef();
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
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
    const msg = Validation(user);
    console.log(msg);
    if (!msg[1]) {
      setIsValid(false);
      setErrorMessage([msg[0], msg[1]]);
    } else {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("http://127.0.0.1:5000/register", {
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
          });
          const data = await response.json();
          console.log(data);

          if (!response.ok) {
            setErrorMessage(data.message);
            throw new Error(data.message);
          }
          setIsValid(true);
          history.replace("/login");
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
      <h1>Sign Up</h1>
      <form onSubmit={submitHandler}>
        <div className="control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="6-25 characters"
            required
            ref={userNameInputRef}
          />
        </div>
        <div className="control">
          <label htmlFor="first-name">First Name</label>
          <input
            type="text"
            id="first-name"
            placeholder="Less than 46 characters"
            required
            ref={firstNameInputRef}
          />
        </div>
        <div className="control">
          <label htmlFor="last-name">Last Name</label>
          <input
            type="text"
            id="last-name"
            placeholder="Less than 46 characters"
            required
            ref={lastNameInputRef}
          />
        </div>
        <div className="control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="E.g: abc@admin.com"
            required
            ref={emailInputRef}
          />
        </div>
        <div className="control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            placeholder="6 to 25 characters"
            ref={passwordInputRef}
          />
        </div>
        <div className="actions">
          {!isLoading && <button>Create Account</button>}
          {isLoading && <FadedLoader color="grey" size="38px" />}
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
