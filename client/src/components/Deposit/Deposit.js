import { useContext, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import "./Deposit.css";
import PropagateLoader from "react-spinners/PropagateLoader";
import PulseLoader from "react-spinners/PulseLoader";

function Deposit() {
  const bankID = useRef();
  const pincode = useRef();
  const money = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [isNotValidImage, setIsNotValidImage] = useState(true);
  const [imageFrame, setImageFrame] = useState(false);
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

  const depositHandler = (event) => {
    event.preventDefault();
    setIsLoading(true);
    const enteredPincode = pincode.current.value;
    const enteredDepositAmount = money.current.value;
    const enteredBankID = bankID.current.value;
    console.log(imageURL);
    if (imageURL.length === 0) {
      setErrorMessage("Please upload the check image");
    } else {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("http://127.0.0.1:5000/deposit", {
            method: "POST",
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
          });
          const data = await response.json();
          console.log(data);
          setIsValid(true);
          if (!response.ok) {
            setErrorMessage(data.message);
            throw new Error(response.status);
          }
        } catch (error) {
          console.log(errorMessage);
          if (errorMessage !== "") {
            setErrorMessage("Something went wrong");
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
    }
    setImageURL("");
    pincode.current.value = "";
    money.current.value = "";
    setIsNotValidImage(true);
  };

  const uploadImage = (files) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "j1omallt");
    setIsNotValidImage(true);

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
        const imageType = ["jpg", "jpeg", "png"];
        const data = await response.json();
        if (!imageType.includes(data.format.toLowerCase())) {
          console.log("WRONG FORMAT");
          throw new Error("Invalid image format");
        }
        setIsNotValidImage(false);
        setImageFrame(true);
        setErrorMessage("");
        console.log(data.format);
        setImageURL(data.url);
      } catch (error) {
        setImageFrame(false);
        // token expired, log the user out
        if (error.message === "401") {
          alert("Token expired. Please login again");
          authCtx.logout();
          history.replace("/login");
        }
        if (error.message === "400") {
          setErrorMessage("Invalid image format");
        } else {
          setErrorMessage(error.message);
        }
      }
    };
    console.log("Finished");

    uploadToCloud();
  };
  let classFrame = "image-frame";
  if (!imageFrame) {
    classFrame = "image-frame-fail";
  }
  let content = <p>You need to open a bank account first</p>;
  if (accountList.length > 0) {
    content = (
      <div>
        <h2>Deposit Check</h2>
        <form onSubmit={depositHandler}>
          <div className="mb-3">
            <label htmlFor="formFile" className="form-label">
              Check Image
            </label>
            <input
              className={`form-control ${classFrame}`}
              onChange={(event) => {
                uploadImage(event.target.files);
              }}
              type="file"
              id="formFile"
            />
          </div>

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
              disabled={isNotValidImage}
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
                disabled={isNotValidImage}
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
            {isValid && <p className="text-success">Transaction Complete</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Deposit;
