import UserProfile from "../components/Profile/UserProfile";
import BankAccountList from "../components/Profile/BankAccounts";
import AuthContext from "../store/auth-context";
import { useContext } from "react";
const ProfilePage = () => {
  const authCtx = useContext(AuthContext);

  return (
    <div>
      {authCtx.isLoggedIn && <UserProfile />}
      {authCtx.isLoggedIn && <BankAccountList />}
    </div>
  );
};

export default ProfilePage;
