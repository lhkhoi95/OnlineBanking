import { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import BankAccount from "./BankAccount/BankAccount";

function BankAccountList(props) {
  const [bankAccounts, setBankAccounts] = useState([]);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  // retrieve the token
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    setIsLoading(true);
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
    setIsLoading(false);
  }, []);

  // display bank accounts to browser
  let content = <div className="container">You have no bank accounts.</div>;
  if (!isLoading && bankAccounts.length !== 0) {
    content = bankAccounts.map((account, index) => (
      <BankAccount key={index} id={account.id} balance={account.balance} />
    ));
  }
  return <div>{content}</div>;
}

export default BankAccountList;
