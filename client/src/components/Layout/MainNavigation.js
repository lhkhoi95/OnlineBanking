import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./MainNavigation.module.css";
import logo from "./images/logo.png";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  // log out
  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>
          <img
            height="50"
            width="50"
            className="mb-3"
            src={logo}
            alt={
              '<a href="https://www.flaticon.com/free-icons/business-and-finance" title="business and finance icons">Business and finance icons created by Linector - Flaticon</a>'
            }
          ></img>
          Purple Bank
        </div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/register">Register</Link>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
          {isLoggedIn && (
            <div className={classes.dropdown}>
              <button className={classes.dropbtn}>Account</button>
              <div className={classes.dropdownContent}>
                <li>
                  <Link to="/openAccount">Open Account</Link>
                </li>
                <li>
                  <Link to="/deposit">Deposit</Link>
                </li>
                <li>
                  <Link to="/withdraw">Withdraw</Link>
                </li>
                <li>
                  <Link to="/transfer">Transfer</Link>
                </li>
                <li>
                  <Link to="/transactions">Transactions</Link>
                </li>
                <li>
                  <Link to="/delete">Close Account</Link>
                </li>
              </div>
            </div>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}

          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
