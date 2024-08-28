import React, { useEffect, useState } from "react";

import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";
import useToken from "../../hooks/useToken";
import Loader from "../loader/Loader";

export default function Security() {
  const [disable, setDisable] = useState(true);
  const [values, setValues] = useState({
    fullname: "",
    phone: "",
    // password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const { token } = useToken();
  const { data, error, loading, request: getUser } = useApi(authApi.getUser);
  const {
    data: updateUserData,
    // error: updateUserError,
    loading: updateUserLoading,
    request: updateUser,
  } = useApi(authApi.updateUser);

  const handleUpdateUser = async () => {
    console.log(values);
    updateUser(values);
  };

  useEffect(() => {
    if (updateUserData?.message === "user_updated_successfully")
      setDisable(true);
  }, [updateUserData]);

  useEffect(() => {
    getUser(token);
  }, [token]);

  useEffect(() => {
    if (data?.user) {
      setValues({ fullname: data?.user.fullname, phone: data?.user.phone });
    }
  }, [data]);

  if (!data || loading) return <Loader type="dots" />;
  else if (error) return <div>{data.message}</div>;

  return (
    <>
      <div className="container my-5 security-page">
        <div className="row">
          <form>
            <div className="user-info-section my-2">
              <label htmlFor="email" className="users-email mt-1">
                E-mail Address{" "}
              </label>
              <input
                name="email"
                type="text"
                placeholder={data?.user.email}
                disabled={true}
              />
            </div>

            <div className="user-info-section my-2">
              <label htmlFor="fullname" className="users-fullname mt-1">
                Full Name{" "}
                <span
                  className="edit-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setDisable(false);
                  }}
                >
                  Edit
                </span>{" "}
              </label>
              <input
                name="fullname"
                value={values.fullname}
                onChange={handleChange}
                type="text"
                placeholder={data?.user.fullname}
                disabled={disable}
              />
            </div>

            <div className="user-info-section my-2">
              <label htmlFor="phone" className="users-number mt-1">
                Mobile Number{" "}
                <span
                  className="edit-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setDisable(false);
                  }}
                >
                  Edit
                </span>{" "}
              </label>
              <input
                name="phone"
                type="rel"
                value={values.phone}
                onChange={handleChange}
                placeholder={data?.user.phone}
                disabled={disable}
              />
            </div>

            {/* <div className="user-info-section my-2">
              <label htmlFor="phone" className="users-number mt-1">
                Update Password{" "}
                <span
                  className="edit-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setDisable(false);
                  }}
                >
                  Edit
                </span>{" "}
              </label>
              <input
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                placeholder="*************"
                disabled={disable}
              />
            </div> */}

            <button
              className="info-btn mt-4"
              onClick={handleUpdateUser}
              disabled={updateUserLoading || disable}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
