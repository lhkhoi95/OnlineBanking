import { useContext, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import "./Withdraw.css";

function Withdraw(props) {
  // withdraw needs 3 inputs: id, passcode, and money
  const bankID = useRef();
  const pincode = useRef();
  const money = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState();
  const [isValid, setIsValid] = useState(false);
  
  const withdrawHandler = (event) => {
    event.preventDefault();
    const enteredPincode = pincode.current.value;
    const enteredWithdrawAmount = money.current.value;
    const enteredBankID = bankID.current.value;
    console.log("Selected Bank ID = " + enteredBankID);

    // props.accounts.forEach((account) => {
    //   if (account.id.toString() === enteredBankID) {
    //     setBalance(account.balance.toString());
    //   }
    // });
    // console.log(balance);

    fetch("http://localhost:5000/withdraw", {
      method: "POST",
      // remember to include JSON.stringigy
      body: JSON.stringify({
        id: enteredBankID,
        passcode: enteredPincode,
        money: enteredWithdrawAmount,
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

  return (
    <div className="container">
      {props.accounts.length === 0 && (
        <p className="text-primary">You need to open a bank account first.</p>
      )}
      {props.accounts.length !== 0 && (
        <div>
          <h2>Withdraw Cash</h2>
          <form onSubmit={withdrawHandler}>
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
                Amount
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
            <button className="btn btn-primary">Withdraw</button>
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

export default Withdraw;
