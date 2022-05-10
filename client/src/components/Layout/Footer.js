import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <div>
      <footer className="bg-light text-center text-lg-start">
        <div className="text-center p-3 footer">
          © 2022 Copyright: <span> </span>
          <a className="text-white" href="http://localhost:3000/">
            PurpleBank
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
