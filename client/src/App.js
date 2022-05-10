import { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AuthContext from "./store/auth-context";
import OpenBankAccount from "./pages/OpenBankAccountPage";
import WithdrawPage from "./pages/WithdrawPage";
import DepositPage from "./pages/DepositPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import TransferMoneyPage from "./pages/TransferMoneyPage";
import CloseAccountPage from "./pages/CloseAccountPage";
import ContactUsPage from "./pages/ContactUsPage";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {!authCtx.isLoggedIn && (
          <Route path="/login">
            <LoginPage />
          </Route>
        )}
        {!authCtx.isLoggedIn && (
          <Route path="/register">
            <RegisterPage />
          </Route>
        )}
        <Route path="/profile">
          {authCtx.isLoggedIn && <ProfilePage />}
          {!authCtx.isLoggedIn && <LoginPage />}
        </Route>
        <Route path="/openAccount">
          {authCtx.isLoggedIn && <OpenBankAccount />}
          {!authCtx.isLoggedIn && <LoginPage />}
        </Route>
        <Route path="/withdraw">
          {authCtx.isLoggedIn && <WithdrawPage />}
          {!authCtx.isLoggedIn && <LoginPage />}
        </Route>
        <Route path="/deposit">
          {authCtx.isLoggedIn && <DepositPage />}
          {!authCtx.isLoggedIn && <LoginPage />}
        </Route>
        <Route path="/transactions">
          {authCtx.isLoggedIn && <TransactionHistoryPage />}
          {!authCtx.isLoggedIn && <LoginPage />}
        </Route>
        <Route path="/transfer">
          {authCtx.isLoggedIn && <TransferMoneyPage />}
          {!authCtx.isLoggedIn && <LoginPage />}
        </Route>
        <Route path="/delete">
          {authCtx.isLoggedIn && <CloseAccountPage />}
          {!authCtx.isLoggedIn && <LoginPage />}
        </Route>
        <Route path="/contactUs">
          <ContactUsPage />
        </Route>
        {/* protect front end pages from manually enter route on browser */}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
