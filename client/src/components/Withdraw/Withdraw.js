import { useContext, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import "./Withdraw.css";
import PropagateLoader from "react-spinners/PropagateLoader";

function Withdraw() {
  // withdraw needs 3 inputs: id, passcode, and money
  const bankID = useRef();
  const pincode = useRef();
  const money = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState();
  const [isValid, setIsValid] = useState(false);
  const [accountList, setAccountList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const withdrawHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const enteredPincode = pincode.current.value;
    const enteredWithdrawAmount = money.current.value;
    const enteredBankID = bankID.current.value;

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
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  let content = <p>You need to open a bank account first</p>;
  if (accountList.length > 0) {
    content = (
      <div>
        <h2>Withdraw Cash</h2>
        <form onSubmit={withdrawHandler}>
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
              type="password"
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
    );
  }
  return (
    <div>
      {isLoading ? (
        <div className="loading-spinner">
          <PropagateLoader color="grey" />
        </div>
      ) : (
        <div className="container">
          {content}
          <div className="error-message">
            {!isValid && <p className="text-danger">{errorMessage}</p>}
            {isValid && <p className="text-success">Transaction complete</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Withdraw;
