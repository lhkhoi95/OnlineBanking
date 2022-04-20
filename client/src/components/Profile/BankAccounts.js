import { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import BankAccount from "./BankAccount/BankAccount";
import AuthForm from "../Login/Login";

function BankAccountList() {
  const [bankAccounts, setBankAccounts] = useState([{}, {}, {}]);
  const history = useHistory();
  // retrieve the token
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    // fetch the list of bank accounts from api
    fetch("http://localhost:5000/bankAccounts", {
      headers: {
        Authorization: "Bearer " + authCtx.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.status);
        }
      })
      .then((data) => {
        setBankAccounts(data.bank_accounts);
      })
      .catch((err) => {
        // token expired, log the user out
        if (err.message === "401") {
          alert("Token expired. Please login again");
          authCtx.logout();
          history.replace("/login");
        }
      });
  }, []);

  return (
    <div>
      {bankAccounts.length === 0 ? (
        <p>You have no bank accounts.</p>
      ) : (
        bankAccounts.map((account, index) => (
          <BankAccount key={index} id={account.id} balance={account.balance} />
        ))
      )}
    </div>
  );
}

export default BankAccountList;
