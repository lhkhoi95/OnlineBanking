import { useContext, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import "./CloseAccount.css";
import PropagateLoader from "react-spinners/PropagateLoader";

function CloseAccount() {
  const bankID = useRef();
  const pincode = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState();
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const deleteHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const enteredPincode = pincode.current.value;
    const enteredBankID = bankID.current.value;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/account", {
          method: "DELETE",
          body: JSON.stringify({
            id: enteredBankID,
            passcode: enteredPincode,
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
        if (errorMessage === "") {
          setErrorMessage(error.message);
        }
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
    pincode.current.value = "";
  };

  let content = <p>You need to open a bank account first</p>;
  if (accountList.length > 0) {
    content = (
      <div>
        <h2>Close Account</h2>
        <p>Please select an account to delete, money will be cashed out</p>
        <form onSubmit={deleteHandler}>
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
          <button className="btn btn-danger">Delete</button>
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
            {isValid && <p className="text-success">Account Deleted</p>}
          </div>
        </div>
      )}
    </div>
  );
}
export default CloseAccount;
