import React, { useEffect, useContext, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import "./Cart.css";
import CartCard from "./CartCard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import cartApi from "../../api/cart";
import { Helmet } from "react-helmet";
import CartDataContext from "../../hooks/CartContext";
import useApi from "../../hooks/useApi";
import useToken from "../../hooks/useToken";
import orderApi from "../../api/order";

export default function Cart() {
  const { isEmpty, totalUniqueItems, items, totalItems, cartTotal, setItems } =
    useCart();
  const { cartData, setCartData } = useContext(CartDataContext);
  const { token } = useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const [isDisabled, setIsDisabled] = useState(false);

  const {
    data,
    request: sendOrder,
    error,
    loading,
  } = useApi(orderApi.newOrder);

  const addToCart = async () => {
    const itemData = items.map((item) => {
      const { _id, quantity } = item;

      return { productId: _id, quantity };
    });

    await cartApi.add({
      totalUniqueItems,
      items: itemData,
      totalItems,
      cartTotal,
    });
  };

  const getCart = async () => {
    const res = await cartApi.getCart();
    console.log(res.data[0].items, "why cart");
    setItems(res.data[0].items);
  };

  useEffect(() => {
    getCart();
    setCartData(items);
  }, []);

  useEffect(() => {
    addToCart();
  }, [totalItems]);

  const handleOrder = () => {
    setIsDisabled(true);
    if (!token)
      return navigate("/login", { state: { from: location.pathname } });

    sendOrder({
      items:
        cartData &&
        cartData.map((item) => {
          return {
            id: item.id,
            quantity: item.quantity,
          };
        }),
    });
  };

  useEffect(() => {
    if (!loading && data?.message === "order_added_success") {
      console.log(data);
      return navigate("/payment", { state: { orderId: data.orderId } });
    } else if (error) return alert(data.message);
  }, [data, loading]);

  if (isEmpty)
    return (
      <>
        <Helmet title="Shopping Cart" url="/cart" />
        <div className="cart-items-body">
          <div className="empty-cart">
            <lottie-player
              src="https://assets4.lottiefiles.com/private_files/lf30_e3pteeho.json"
              background="transparent"
              speed="1"
              style={{ width: "280px", height: "280px" }}
              loop
              autoplay
            ></lottie-player>
            <p>
              Your cart is empty!! <br /> Browse our products and add to your
              cart.
            </p>
            <Link to="/products" className="info-btn">
              Add Items
            </Link>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Helmet title="Cart" url="/cart" />
      <div className="cart-page">
        <div className="cart-items">
          <div className="cart-heading my-2">
            <div className="fs-3">
              Products in your cart ({totalUniqueItems})
            </div>
            <Link to="/products" className="add-btn">
              Add More
            </Link>
          </div>
          <div className="cart-items-body">
            {items?.map((item) => {
              return <CartCard {...item} key={item.id} />;
            })}
          </div>
        </div>
        {/* <div className="cart-action">
          <div className="order-summary">
            <FaCheckCircle color="#03CD0B" fontSize={30} />
            <p>
              Your order is eligible for FREE Delivery, you can select this
              option at checkout. Details
            </p>
          </div>

          <div className="order-details fs-5">
            Subtotal ({totalItems} Items) :
            <span style={{ fontWeight: "500" }}> ₹ {cartTotal} </span>
          </div>
          <div
            onClick={handleOrder}
            style={{
              opacity: isDisabled ? 0.5 : 1,
              pointerEvents: isDisabled ? "none" : "auto",
              textDecoration: "none",
            }}
          >
            <div className="buy-btn">
              {loading ? "Redirecting..." : "Proceed to Buy"}
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
