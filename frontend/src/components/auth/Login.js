import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Login.css";
import LoginGirl from "../../assets/loginGirl.png";
import google from "../../assets/google.png";
import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";
import useToken from "../../hooks/useToken";
import { Helmet } from "react-helmet";

export default function Login() {
  const { state } = useLocation();

  const [values, setValues] = useState({
    email: state?.email ? state.email : "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [finalError, setFinalError] = useState("");

  const {
    data: loginData,
    request: login,
    loading,
    error,
    networkError,
  } = useApi(authApi.login);

  const {
    data: googleUrlData,
    request: googleLogin,
    // loading,
    error: googleLoginError,
    networkError: googleNetworkError,
  } = useApi(authApi.googleLogin);

  const { setToken, setName } = useToken();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  async function handleSubmit() {
    if (!values.email) setEmailError("Email required!");
    else if (!/\S+@\S+\.\S+/.test(values.email))
      setEmailError("Email address is invalid!");
    else setEmailError("");

    if (!values.password) setPassError("Enter Password");
    else if (values.password.length < 6) setPassError("Wrong Password");
    else setPassError("");

    if (
      emailError.length <= 0 &&
      passError.length <= 0 &&
      values.email.length > 0 &&
      values.password.length > 0
    ) {
      login({
        email: values.email,
        password: values.password,
      });
    }
  }

  const { from } = state || { from: "/" };

  useEffect(() => {
    if (loginData && !error && !loading) {
      setName(loginData.user.fullname);
      setToken(loginData.token);
      return window.location.replace(from, { replace: true });
    } else if (error) {
      setFinalError(loginData.message);
      console.log(error);
    } else if (networkError) {
      console.log(networkError);
      setFinalError("Network Error");
    }
  }, [loginData, networkError]);

  useEffect(() => {
    console.log(googleUrlData);
    if (googleUrlData) {
      window.location.replace(googleUrlData.url);
    }
  }, [googleUrlData]);

  return (
    <>
      <Helmet title="Login" url="/login" />
      <div className="container-fluid loginPage">
        <div className="row">
          <div className="loginPage-left col-lg-6 col-sm-6">
            <div className="register-here mb-2">
              New User?
              <Link to="/signup" state={state}>
                {" "}
                Register Here
              </Link>
            </div>
            <p>
              Join us and stay tuned to all <br /> the updates and
              notifications!
            </p>
            <img src={LoginGirl} alt="LoginGirl" />
          </div>
          <div className="loginPage-right col-lg-6 col-sm-6">
            <div className="form">
              <div className="form-heading my-2">
                <h2>Login</h2>
                <p>Welcome onboard with us!</p>
              </div>

              <form>
                <label htmlFor="">
                  E-mail
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your e-mail"
                    value={values.email}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                  {emailError ? (
                    <div className="error_message">{emailError}</div>
                  ) : (
                    ""
                  )}
                </label>
                <label htmlFor="">
                  Password
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                  />
                  {passError.length > 0 ? (
                    <div className="error_message">{passError}</div>
                  ) : (
                    ""
                  )}
                </label>
                <br />
                {(error || networkError) && (
                  <div className="error_message mx-auto mb-2">{finalError}</div>
                )}
                <div onClick={handleSubmit} className="dislodged-border">
                  {!loading ? "Login" : "Wait..."}
                </div>

                <div className="with-google my-4" onClick={googleLogin}>
                  Continue with <img src={google} className="mx-1" alt="" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
