import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

import "./Dashboard.css";
import DashCards from "./DashCards.js";
import useToken from "../../hooks/useToken";
import { useCart } from "react-use-cart";
import { Helmet } from "react-helmet";

export default function Dashboard() {
  const navigate = useNavigate();
  const { name, removeToken, removeName } = useToken();

  const { emptyCart } = useCart();

  // const { state } = useLocation();

  const handleLogout = () => {
    document.cookie =
      "auth_token=; domain=.; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    removeName();
    removeToken();
    emptyCart();
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <Helmet title="My Profile" url="/dashboard" />
      <div className="container my-4">
        <div className="row">
          <div className="container my-5">
            <div className="dashboard-top my-2">
              <div className="p-2 fs-2 section-heading ">Hello 👋, {name}</div>
              <div className="logout text-center " onClick={handleLogout}>
                <span className="me-1">
                  <FaSignOutAlt />
                </span>
                LogOut
              </div>
            </div>

            <Outlet />

            <div className="row dashboard-row">
              <DashCards
                url="orders"
                image="FaBoxOpen"
                title="My Orders"
                description="Track , return , check history or buy things again."
              />
              <DashCards
                url="wishlist"
                image="FaGift"
                title="Wishlist"
                description="Browse your personalized collections of products ."
              />
              <DashCards
                url="security"
                image="FaUserLock"
                title="Login & Security"
                description="Edit login, , name , mobile number , address."
              />
              <DashCards
                url="my-addresses"
                image="TiLocation"
                title="My Addresses"
                description="Edit addresses for your orders and gifts."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
