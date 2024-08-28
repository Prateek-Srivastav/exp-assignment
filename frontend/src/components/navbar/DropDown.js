import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { BiLockOpenAlt } from "react-icons/bi";
import { AiOutlineGift } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import "./Dropdown.css";

export const Dropdown = ({ firstName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown_menu">
      <Link
        to="/dashboard/security"
        className="d-flex flex-row align-items-center justify-content-center text-sm"
        // onClick={toggleDropdown}
        // onMouseEnter={() => setIsOpen(true)}
        // onMouseLeave={() => setIsOpen(false)}
      >
        <div className="d-flex flex-row flex-lg-column align-items-center">
          <span>
            <FaUserCircle />
          </span>
          <div>{firstName && firstName}</div>
        </div>
        {/* {firstName && (
          <svg
            className={`ml-1 ${isOpen ? "rotate_180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )} */}
      </Link>
      {/* {isOpen && firstName && (
        <div
          className="dropdown_options d-flex flex-column px-3 pt-2 bg-white rounded shadow"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="hello_name">
            Hello 👋, <span className="name_span"> {firstName} </span>
          </div>
          <Link
            onClick={() => setIsOpen(false)}
            className="dropdown_link"
            to="/dashboard/security"
          >
            <span className="security_span">
              <BiLockOpenAlt />
            </span>
            <div>Security</div>
          </Link>
        </div>
      )} */}
    </div>
  );
};

export default Dropdown;
