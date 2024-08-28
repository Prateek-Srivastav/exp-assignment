import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";

export default function CartCard(props) {
  const { removeItem, updateItemQuantity } = useCart();

  return (
    <>
      <div className="cart-card">
        <div className="cart-image">
          <Link to={`/products/${props._id}`}>
            <img src={props.urls && props.urls[0]} alt="" />
          </Link>
        </div>
        <div className="cart-details">
          <Link to={`/products/${props._id}`}>
            <div className="item-name">
              {props.prodName
                ? props.prodName.length > 30
                  ? props.prodName.slice(0, 30) + "..."
                  : props.prodName
                : ""}
            </div>
          </Link>
          <div className="author-name">Author : {props.authorName}</div>
          {/* {props.inStock ? (
            <div className="in_stock">In Stock</div>
          ) : (
            <div className="unavailable">Currently-Unavailable</div>
          )} */}

          {/* <div className="set-quantity mt-1">
            <span className="me-2">Quantity : </span>
            <button
              onClick={() => updateItemQuantity(props.id, props.quantity - 1)}
              className="set-count-btn "
            >
              -
            </button>
            <span className="quantity mx-1"> {props.quantity} </span>
            <button
              onClick={() => updateItemQuantity(props.id, props.quantity + 1)}
              className="set-count-btn"
            >
              +
            </button>
          </div> */}
          {/* <div className="product-price my-1">
            ₹ {props.prodSp}{" "}
            <span className="line_through_text">{props.prodMrp}</span>
            <span className="saving"> {props.discount}% Off</span>
          </div> */}
          <div className="d-flex flex-row justify-content-center align-items-center">
            <div
              className="remove-btn mx-2"
              type="button"
              onClick={() => {
                removeItem(props.id);
                // updateCart();
              }}
            >
              {" "}
              Remove{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
