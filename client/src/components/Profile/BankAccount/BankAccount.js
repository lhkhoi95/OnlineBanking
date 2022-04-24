import classes from "./BankAccount.module.css";

function BankAccount(props) {
  return (
    <div className={classes.card}>
      <p className={classes.cardTitle}>Bank Account</p>
      <ul>
        <li className={classes.cardItem}>
          <span>Bank ID:</span>
          <span className={classes.rightAlign}>{props.id}</span>
        </li>
        <li className={classes.cardItem}>
          <span>Balance:</span>
          <span className={classes.rightAlign}>
            {props.balance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </li>
      </ul>
    </div>
  );
}

export default BankAccount;
