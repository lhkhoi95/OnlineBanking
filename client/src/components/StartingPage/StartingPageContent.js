import classes from "./StartingPageContent.module.css";
import welcome from "./images/welcome.jpg";

const StartingPageContent = () => {
  return (
    <section className={classes.starting}>
      <h1>Welcome to Online Banking!</h1>
      <div>
        <img
          className={classes.image}
          src={welcome}
          alt="Bank account vector created by vectorjuice - www.freepik.com"
        ></img>
      </div>
    </section>
  );
};

export default StartingPageContent;
