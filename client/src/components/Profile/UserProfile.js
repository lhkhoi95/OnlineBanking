import ProfileForm from "./ProfileForm";
import classes from "./UserProfile.module.css";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const UserProfile = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [userInformation, setUserInformation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/user", {
      headers: {
        Authorization: "Bearer " + authCtx.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log("Token expired", res.status);
          throw new Error(res.status);
        }
      })
      .then((data) => {
        console.log(data);
        setUserInformation(data);
      })
      .catch((err) => {
        // token expired, log the user out
        if (err.message === "401") {
          authCtx.logout();
          history.replace("/login");
        }
      });
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  return (
    <section className={classes.profile}>
      {isLoading ? (
        <ClipLoader color={"#ffff"} />
      ) : (
        <div>
          <h1>Hi, {userInformation.first_name}!</h1>
          <ProfileForm
            firstName={userInformation.first_name}
            lastName={userInformation.last_name}
            email={userInformation.email}
            userID={userInformation.user_id}
          />
        </div>
      )}
    </section>
  );
};

export default UserProfile;
