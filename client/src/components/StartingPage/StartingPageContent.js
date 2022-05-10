import classes from "./StartingPageContent.module.css";
import welcome from "./images/welcome.jpg";

const StartingPageContent = () => {
  return (
    <section className={classes.starting}>
      <h2>Welcome to Purple Bank!</h2>
      <p>A website that makes any transactions faster than ever</p>

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
