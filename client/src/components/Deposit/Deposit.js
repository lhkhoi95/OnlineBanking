import { useContext, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import "./Deposit.css";

function Deposit(props) {
  const bankID = useRef();
  const pincode = useRef();
  const money = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState();
  const [isValid, setIsValid] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  const depositHandler = (event) => {
    event.preventDefault();

    const enteredPincode = pincode.current.value;
    const enteredDepositAmount = money.current.value;
    const enteredBankID = bankID.current.value;

    console.log("Selected Bank ID = " + enteredBankID);

    fetch("http://localhost:5000/deposit", {
      method: "POST",
      // remember to include JSON.stringigy
      body: JSON.stringify({
        id: enteredBankID,
        passcode: enteredPincode,
        money: enteredDepositAmount,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authCtx.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            setIsValid(false);
            setErrorMessage(data.message);
            console.log(data);
            throw new Error(res.status);
          });
        }
      })
      .then((data) => {
        setIsValid(true);
        console.log(data);
      })
      .catch((err) => {
        if (err.message === "401") {
          alert("Token expired. Please login again");
          authCtx.logout();
          history.replace("/login");
        }
      });
  };

  const fileSelectedHandler = (event) => {
    console.log(event.target.files);
    setSelectedFile(event.target.files[0]);
  };

  const fileUploadHandler = (event) => {};

  return (
    <div className="container">
      {props.accounts.length === 0 && (
        <p className="text-primary">You need to open a bank account first.</p>
      )}
      {props.accounts.length !== 0 && (
        <div>
          <h2>Deposit Check</h2>
          <form onSubmit={depositHandler}>
            {/* <label className="form-label" htmlFor="pincode">
              Check Image:
            </label> */}
            <input type="file" onChange={fileSelectedHandler}></input>
            <div className="mb-3">
              <select id="bankIDs" ref={bankID}>
                {props.accounts.map((account, index) => {
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
              <label className="form-label" htmlFor="money">
                Amount on the check
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                </div>
                {/* add more options later $20 $50 $80 $100*/}
                <input
                  placeholder="E.g: $20"
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
            <button onClick={fileUploadHandler} className="btn btn-primary">
              Deposit
            </button>
          </form>
        </div>
      )}
      <div className="error-message">
        {!isValid && <p className="text-danger">{errorMessage}</p>}
        {isValid && <p className="text-success">Transaction complete</p>}
      </div>
    </div>
  );
}

export default Deposit;
