import React from "react";
import { Link } from "react-router-dom";
import errorImg from "../../assets/errorImg.png";
import "./Error.css";

export default function Error() {
  return (
    <div>
      <div className="container my-5">
        <div className="row">
          <div className="error-page my-5">
            <img src={errorImg} alt="errorImg" />
            <p className="text-center my-4">
              The page you are looking for doesn't exists or some error occured
              , please go to home page.
            </p>

            <Link to="/" style={{ textDecoration: "none" }}>
              <div className="button-curved"> &rarr;</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
