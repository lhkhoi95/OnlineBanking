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
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const depositHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const enteredPincode = pincode.current.value;
    const enteredDepositAmount = money.current.value;
    const enteredBankID = bankID.current.value;

    // console.log("Selected Bank ID = " + enteredBankID);
    // console.log("Image URL: " + typeof imageURL);
    if (imageURL.length === 0) {
      setErrorMessage("Please upload the check image");
    } else {
      fetch("http://localhost:5000/deposit", {
        method: "POST",
        // remember to include JSON.stringigy
        body: JSON.stringify({
          id: enteredBankID,
          passcode: enteredPincode,
          money: enteredDepositAmount,
          url: imageURL,
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

      pincode.current.value = "";
      money.current.value = "";
    }
    setIsLoading(false);
  };

  const uploadImage = (files) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "j1omallt");

    const uploadToCloud = async () => {
      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dpvbklkd7/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) {
          setIsValid(false);
          throw new Error(response.status);
        }

        const data = await response.json();
        console.log(data.url);
        setImageURL(data.url);
      } catch (error) {
        // token expired, log the user out
        console.log(error.message);
      }
    };
    uploadToCloud();
  };

  let content = <p>You need to open a bank account first</p>;
  if (props.accounts.length !== 0) {
    content = (
      <div>
        <h2>Deposit Check</h2>
        <form onSubmit={depositHandler}>
          <div className="mb-3">
            <label htmlFor="formFile" className="form-label">
              Image Check
            </label>
            <input
              className="form-control"
              onChange={(event) => {
                uploadImage(event.target.files);
              }}
              type="file"
              id="formFile"
            />
          </div>
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
              type="password"
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
          <button className="btn btn-primary">Deposit</button>
        </form>
      </div>
    );
  }
  return (
    <div className="container">
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

export default Deposit;
