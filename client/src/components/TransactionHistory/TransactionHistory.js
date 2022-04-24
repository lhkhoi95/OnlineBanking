import { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import "./TransactionHistory.css";

function TransactionHistory() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/history", {
          headers: {
            Authorization: "Bearer " + authCtx.token,
          },
        });
        if (!response.ok) {
          throw new Error(response.status);
        }

        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        // token expired, log the user out
        if (error.message === "401") {
          alert("Token expired. Please login again");
          authCtx.logout();
          history.replace("/login");
        }
      }
    };
    fetchData();
    setIsLoading(false);
  }, []);

  let content = <p>You have no transactions</p>;
  if (transactions.length > 0) {
    content = (
      <table className="container table table-bordered">
        <caption>Transaction History</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Bank ID</th>
            <th scope="col">Amount</th>
            <th scope="col">Date</th>
            <th scope="col">Check Image </th>
          </tr>
        </thead>
        {transactions.map((t, index) => {
          return (
            <tbody key={index}>
              <tr>
                <th scope="row">{index}</th>
                <td>{t.bank_id}</td>
                {t.transfer_amount.includes("+") ? (
                  <td className="text-primary">
                    {"+" +
                      parseFloat(t.transfer_amount.substring(2)).toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                  </td>
                ) : (
                  <td className="text-danger">
                    {"-" +
                      parseFloat(t.transfer_amount.substring(2)).toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                  </td>
                )}
                <td>{t.date}</td>
                <td>
                  {t.transfer_amount.includes("+") && (
                    <button
                      className="btn-primary submit-button"
                      type="button"
                      onClick={() => {
                        window.open(t.url);
                      }}
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    );
  }
  return (
    <div>
      {!isLoading && content}
      {isLoading && <p className="text-primary">Loading...</p>}
    </div>
  );
}

export default TransactionHistory;
