import React, { useContext, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import "./TransferMoney.css";

function TransferMoney() {
  // transfer needs 4 inputs: id, money, passcode, and recipient's email
  const bankID = useRef();
  const pincode = useRef();
  const money = useRef();
  const email = useRef();
  const message = useRef("");
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [accountList, setAccountList] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/bankAccounts", {
          headers: {
            Authorization: "Bearer " + authCtx.token,
          },
        });
        if (!response.ok) {
          throw new Error(response.status);
        }

        const data = await response.json();
        setAccountList(data.bank_accounts);
      } catch (error) {
        setIsValid(false);
        // token expired, log the user out
        if (error.message === "401") {
          alert("Token expired. Please login again");
          authCtx.logout();
          history.replace("/login");
        }
      }
    };
    fetchData();
    setIsLoading(false);
  }, []);

  function submitHandler(event) {
    event.preventDefault();
    const enteredBankID = bankID.current.value;
    const enteredAmount = money.current.value;
    const enteredPasscode = pincode.current.value;
    const enteredEmail = email.current.value;
    let enteredMessage = message.current.value;

    if (enteredMessage.length === 0) {
      enteredMessage = "No Message";
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/transfer", {
          method: "POST",
          body: JSON.stringify({
            id: enteredBankID,
            money: enteredAmount,
            passcode: enteredPasscode,
            recipient_email: enteredEmail,
            description: enteredMessage,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        });
        const data = await response.json();
        console.log(data);
        setIsValid(true);
        if (!response.ok) {
          setErrorMessage(data.message);
          throw new Error(response.status);
        }
      } catch (error) {
        setIsValid(false);
        // token expired, log the user out
        if (error.message === "401") {
          alert("Token expired. Please login again");
          authCtx.logout();
          history.replace("/login");
        }
      }
    };
    fetchData();
    setIsLoading(false);
  }

  let content = <p>You need to open a bank account first</p>;
  if (accountList.length > 0) {
    content = (
      <form onSubmit={submitHandler}>
        <h2>Transfer Money</h2>
        <div className="mb-3">
          <select id="bankIDs" ref={bankID}>
            {accountList.map((account, index) => {
              return (
                <option key={index} value={account.id}>
                  Bank ID: {account.id}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="pincode">
            Pincode
          </label>
          <input
            placeholder="4-digit pincode"
            type="text"
            id="pincode"
            className="form-control"
            required
            ref={pincode}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <div className="input-group">
            <div className="input-group">
              <input
                type="email"
                id="email"
                placeholder="E.g: abc@admin.com"
                className="form-control"
                required
                ref={email}
              />
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="money">
            Amount
          </label>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">$</span>
            </div>
            {/* add more options later $20 $50 $80 $100*/}
            <input
              placeholder="E.g: $10"
              type="number"
              step="0.01"
              min="0"
              id="amount"
              className="form-control"
              required
              ref={money}
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="description">
            Description
          </label>
          <div className="input-group">
            <textarea
              id="w3review"
              name="w3review"
              rows="4"
              cols="30"
              maxlength="100"
              placeholder="What's it for? (100 characters)"
              ref={message}
            ></textarea>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    );
  }

  return (
    <div className="container parent-container">
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <div>
          {content}
          <div className="error-message">
            {!isValid && <p className="text-danger">{errorMessage}</p>}
            {isValid && <p className="text-success">Transaction Complete</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default TransferMoney;
