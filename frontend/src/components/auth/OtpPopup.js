import React, { useEffect, useRef, useState } from "react";

import { FaRedo, FaTimes } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import useApi from "../../hooks/useApi";
import authApi from "../../api/auth";
import useToken from "../../hooks/useToken";
import { Link, useNavigate } from "react-router-dom";

export default function OtpPopup(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const {
    data: verifyOtpData,
    request: verifyOtp,
    loading,
    error,
    networkError,
  } = useApi(authApi.verifyOtp);

  const handleInputChange = (index, event) => {
    setErrorMessage("");
    const value = event.target.value;
    if (value !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && event.target.value === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const { setToken, setName } = useToken();

  async function handleSubmit() {
    const otp = inputRefs.current.map((inputRef) => inputRef.value);

    verifyOtp({
      email: props.userData.email,
      otp: otp.join(""),
    });
  }

  useEffect(() => {
    if (verifyOtpData && !error && !loading) {
      setName(verifyOtpData.user.fullname);
      setToken(verifyOtpData.token);
      return window.location.replace(props.from, { replace: true });
    } else if (error) {
      setErrorMessage(verifyOtpData.message);
      console.log(error);
    } else if (networkError) {
      console.log(networkError);
    }
  }, [verifyOtpData, networkError]);

  return (
    props.trigger && (
      <div className="popupPage ">
        <div className="popup">
          <div className="close" onClick={() => props.setTrigger(false)}>
            <FaTimes />
          </div>
          {props.signupData?.message === "User already registered." ? (
            <>
              <h1 className="user-email my-3">
                Hi! 👋, <span> {props.userData.fullname}</span>
              </h1>
              <p>You're already registered.</p>
              <p>
                Please{" "}
                <Link to="/login" state={{ email: props.userData.email }}>
                  login
                </Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="user-email my-3">
                Hi! 👋, <span> {props.userData.email}</span>
              </h1>
              <p>
                We've sent an OTP to the above provided mail , please enter the
                OTP to verify your mail.
              </p>

              <div
                id="otp"
                className="otp inputs d-flex flex-row justify-content-center mt-2"
              >
                {[...Array(6)].map((_, index) => {
                  return (
                    <input
                      className="otp-field mx-1"
                      key={index}
                      type="text"
                      maxLength={1}
                      ref={(el) => (inputRefs.current[index] = el)}
                      onChange={(event) => handleInputChange(index, event)}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                      onFocus={(e) => e.target.select()}
                    />
                  );
                })}
              </div>

              <div className="otp-buttons  mt-4 ">
                <div
                  className="clear-btn mx-1"
                  onClick={(e) => {
                    inputRefs.current.forEach(
                      (inputRef) => (inputRef.value = "")
                    );
                    inputRefs.current[0].focus();
                  }}
                >
                  Clear
                </div>
                <div
                  className="buy-btn mx-1"
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                >
                  Validate
                </div>
              </div>
              <div className="error-message">
                {errorMessage ? (
                  <>
                    <FiAlertCircle />
                    {errorMessage}
                  </>
                ) : (
                  ""
                )}
              </div>
              <div className="resend-otp">
                Resend OTP
                <span className="mx-1">
                  <FaRedo />
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
}
