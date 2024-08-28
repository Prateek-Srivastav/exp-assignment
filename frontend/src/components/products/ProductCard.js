import React, { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { BsCartPlus, BsFillCartCheckFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";

import cartApi from "../../api/cart";

export default function ProductCard(props) {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/products/${props._id}`);
  };
  const { addItem, getItem, totalItems, cartTotal, totalUniqueItems, items } =
    useCart();
  const checkItemInCart = getItem(props._id);

  const addToCart = async () => {
    console.log("HERE");
    const itemData = items.map((item) => {
      const { _id, quantity } = item;
      console.log(items);
      return { productId: _id, quantity };
    });

    await cartApi.add({
      totalUniqueItems,
      items: itemData,
      totalItems,
      cartTotal,
    });
  };

  // useEffect(() => {
  //   addToCart();
  // }, [totalItems]);

  return (
    <>
      {!props.navigator ? (
        <div className=" product-card ">
          <div className="product-image">
            <div
              className="product-bg-image"
              style={{ backgroundImage: `url(${props.urls[0]})` }}
            />
            <div className="product-foreground">
              <Link to={`${props._id} `} style={{ textDecoration: "none" }}>
                <img src={props.urls[0]} alt="img" />
              </Link>
              <div className="over-image">
                <span
                  className="wishlist-btn my-2"
                  onClick={() => {
                    console.log("clicked");
                    addItem({
                      id: props._id,
                      price: props.prodSp,
                      ...props,
                    });
                    addToCart();
                  }}
                >
                  {checkItemInCart ? <BsFillCartCheckFill /> : <BsCartPlus />}
                </span>
              </div>
            </div>
          </div>

          <div className="product-details">
            <div className="product-title mt-2">
              <Link to={`${props._id} `} style={{ textDecoration: "none" }}>
                {props.prodName.length > 15
                  ? props.prodName.slice(0, 15) + "..."
                  : props.prodName}
              </Link>
            </div>
            {props.ownerName && <div>Listed by: {props.ownerName}</div>}
          </div>
        </div>
      ) : (
        <div className=" product-card " onClick={handleNavigate}>
          <div className="product-image">
            <img src={props.urls[0]} alt="" />
            <div className="over-image">
              <span
                className="wishlist-btn my-2"
                onClick={() => {
                  addItem({
                    id: props._id,
                    price: props.prodSp,
                    ...props,
                  });
                  addToCart();
                }}
              >
                {checkItemInCart ? <BsFillCartCheckFill /> : <BsCartPlus />}
              </span>
            </div>
          </div>

          <div className="product-details">
            <div className="product-title mt-2 fs-5">
              <Link to={`${props._id} `} style={{ textDecoration: "none" }}>
                {props.prodName.length > 15
                  ? props.prodName.slice(0, 15) + "..."
                  : props.prodName}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
