import { useContext, useEffect, useState } from "react";
import AuthContext from "../store/auth-context";
import { useHistory } from "react-router-dom";
import Deposit from "../components/Deposit/Deposit";

const DepositPage = () => {
  // we first need to fetch the bankIDList
  const authCtx = useContext(AuthContext);
  const [bankAccount, setBankAccount] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (!isLoaded) {
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
          // data.bank_accounts.forEach((account) => {
          //   setBankAccount((currentArray) => [...currentArray, account.id]);
          // });
          console.log(data.bank_accounts);
          setBankAccount(data.bank_accounts);
        })
        .catch((err) => {
          // token expired, log the user out
          if (err.message === "401") {
            alert("Token expired. Please login again");
            authCtx.logout();
            history.replace("/login");
          }
        });
      setIsLoaded(true);
    }
  }, []);

  return (
    <div>
      {isLoaded && <Deposit accounts={bankAccount} />}
      {!isLoaded && <p className="text-primary">Loading...</p>}
    </div>
  );
};

export default DepositPage;
