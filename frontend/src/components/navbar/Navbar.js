import React, { useState } from "react";
import "./Navbar.css";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import navLogo from "../../assets/expclub-logo.png";
import { useCart } from "react-use-cart";
import SearchBar from "./SearchBar";
import useToken from "../../hooks/useToken";
import Dropdown from "./DropDown";

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { totalUniqueItems } = useCart();

  const { name } = useToken();
  let firstName;
  if (name) {
    const trimmedFullName = name && name.trim();
    const nameArray = trimmedFullName.split(" ");
    firstName = nameArray[0];
  }
  return (
    <>
      <nav>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="nav-logo fs-4">
            <img src={navLogo} alt="logo" className="mx-1" />{" "}
          </div>
        </Link>

        <SearchBar />
        <div className={isExpanded ? "nav-menu expanded" : "nav-menu"}>
          <Link
            to="/listing"
            className="nav-menu-item"
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            <span>
              <FaShoppingCart />
            </span>
            List Books
          </Link>
          <Link
            to="/cart"
            className="nav-menu-item"
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            <span>
              <FaShoppingCart /> ({totalUniqueItems})
            </span>
            Cart
          </Link>
          {firstName ? (
            <div className="nav-menu-item d-flex flex-row">
              <Dropdown firstName={firstName} />
            </div>
          ) : (
            <Link
              to="dashboard"
              className="nav-menu-item"
              onClick={() => {
                setIsExpanded(!isExpanded);
              }}
            >
              <span>
                <FaUserCircle />
              </span>
              Sign In
            </Link>
          )}
        </div>
        <div
          className="nav-btns fs-2"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {!isExpanded ? <HiMenuAlt3 /> : <HiX />}
        </div>
      </nav>
    </>
  );
}
