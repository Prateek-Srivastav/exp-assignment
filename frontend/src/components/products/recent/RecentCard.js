import React from "react";
import { MdArrowForward } from "react-icons/md";
import { Link } from "react-router-dom";

export default function RecentCard({ product }) {
  console.log(product, "product");
  return (
    <>
      <Link
        to={`/products/${product._id}`}
        className="border m-2 col-lg-2 col-sm-6 p-2 rounded"
        style={{ textDecoration: "none" }}
      >
        <div className="w-fit d-flex items-center justify-content-center">
          <img
            src={product.urls[0]}
            alt={`Product ${product.prodName}`}
            className="w-fit"
            style={{ height: "150px", width: "full", borderRadius: "5px" }}
          />
        </div>
        <div className="d-flex items-center justify-content-between fs-6 mt-2 text-center text-decoration-none text-secondary">
          <div>Price: ₹{product.prodSp ? product.prodSp : "NA"}</div>
          <div>
            <MdArrowForward />
          </div>
        </div>
      </Link>
    </>
  );
}
