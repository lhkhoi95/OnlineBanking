import { useContext, useEffect, useState } from "react";
import Withdraw from "../components/Withdraw/Withdraw";
import AuthContext from "../store/auth-context";
import { useHistory } from "react-router-dom";

const WithdrawPage = () => {
  // we first need to fetch the bankIDList
  const authCtx = useContext(AuthContext);
  const [bankAccount, setBankAccount] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const history = useHistory();
  const [canWithdraw, setCanWithDraw] = useState(false);

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
          if (data.bank_accounts.length !== 0) {
            setCanWithDraw(true);
          }
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
      <Withdraw accounts={bankAccount} />;
    </div>
  );
};

export default WithdrawPage;
