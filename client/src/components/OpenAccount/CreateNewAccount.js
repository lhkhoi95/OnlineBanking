import { useContext, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import "./CreateNewAccount.css";
import ClipLoader from "react-spinners/ClipLoader";

function CreateNewAccount() {
  const pincode = useRef();
  const pincodeCheck = useRef();
  const [isValid, setIsValid] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const validatePincodes = (pincode, confirmPincode) => {
    return pincode === confirmPincode;
  };
  // need submithandler for the form
  const submitHandler = (event) => {
    event.preventDefault();
    const enteredPincode = pincode.current.value;
    const reEnteredPincode = pincodeCheck.current.value;
    if (!validatePincodes(enteredPincode, reEnteredPincode)) {
      setIsValid(false);
      setErrorMessage("Inputs must match");
    } else {
      setIsLoading(true);
      fetch("http://localhost:5000/openBankAccount", {
        method: "POST",
        // remember to include JSON.stringigy
        body: JSON.stringify({
          passcode: enteredPincode,
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
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  let loadingContent = (
    <div className="sweet-loading">
      <ClipLoader size={20} color="grey" />
    </div>
  );

  return (
    <div className="container">
      <h2>Create a pincode</h2>
      <form onSubmit={submitHandler}>
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
          <label className="form-label" htmlFor="pincodeCheck">
            Confirm pincode
          </label>
          <input
            placeholder="Re-enter 4-digit pincode"
            type="password"
            id="pincodeConfirm"
            className="form-control"
            required
            ref={pincodeCheck}
          />
        </div>
        {isLoading ? (
          loadingContent
        ) : (
          <button className="btn btn-primary">Open Bank Account</button>
        )}
      </form>
      <div className="error-message">
        {!isValid && !isLoading && (
          <p className="text-danger">{errorMessage}</p>
        )}
        {isValid && !isLoading && (
          <p className="text-success">Bank account created</p>
        )}
      </div>
    </div>
  );
}

export default CreateNewAccount;
