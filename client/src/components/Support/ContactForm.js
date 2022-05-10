import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import "./ContactForm.css";
import RingLoader from "react-spinners/RingLoader";

export const ContactUs = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOK, setIsOK] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    emailjs
      .sendForm(
        "service_wiviaj5",
        "template_cglon8z",
        e.target,
        "2jChSqhL8JSUSZ6Wc"
      )
      .then(
        (result) => {
          setIsOK(true);
          setErrorMessage("Success! We will contact you within 24 hours.");
          console.log(result.text);
        },
        (error) => {
          setErrorMessage("Something went wrong!");
          setIsOK(false);
          console.log(error.text);
        }
      );
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  let style = "message-success";
  if (!isOK) {
    style = "message-failure";
  }
  return (
    <div className="container auth">
      <form onSubmit={sendEmail}>
        <div className="control">
          <label className="my-label" htmlFor="username">
            Your Name
          </label>
          <input
            type="text"
            id="username"
            autoFocus={true}
            placeholder="Your Full Name"
            name="from_name"
            required
          />
        </div>
        <div className="control">
          <label className="my-label" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            id="email"
            placeholder="Email address"
            name="to_name"
            required
          />
        </div>
        <div className="control">
          <label className="my-label" htmlFor="description">
            Description:
          </label>
          <textarea
            className="form-control"
            id="description"
            name="message"
            placeholder="Why you need us?"
            rows="4"
            cols="50"
          />
        </div>
        <div className="actions">
          {!isLoading && <button className="btn-primary">Send</button>}
          {isLoading && <RingLoader size="32px" color="grey" />}
        </div>
        <div className={style}>{!isLoading && errorMessage}</div>
      </form>
    </div>
  );
};
