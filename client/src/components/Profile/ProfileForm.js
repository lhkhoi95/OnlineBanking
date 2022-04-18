import classes from "./ProfileForm.module.css";
import profile from "./images/profile.png";

const ProfileForm = (props) => {
  return (
    <div className={classes.card}>
      <img src={profile} alt="Avatar" className={classes.img} />
      <div className={classes.container}>
        <h4>
          <b>
            {props.firstName} {props.lastName}
          </b>
        </h4>
        <p>User ID: {props.userID}</p>
        <p>Email: {props.email}</p>
      </div>
    </div>
  );
};

export default ProfileForm;
