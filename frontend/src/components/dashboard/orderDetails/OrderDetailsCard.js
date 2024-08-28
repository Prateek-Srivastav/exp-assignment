import React from "react";
import "./OrderDetailsCard.css";

const OrderDetailsCard = ({ order }) => {
  const {
    products,
    buyerId,
    totalProductsAmount,
    totalWeight,
    deliveryCharge,
    status,
    createdAt,
  } = order;

  return (
    <div className="order-details-card px-3 py-2 my-2">
      <div className="d-flex flex-wrap fs-6 justify-content-between">
        <div>Order ID: {buyerId}</div>
        <div className="fs-6 text-secondary">Date: {createdAt}</div>
      </div>
      <div className="order-details-content">
        <div className="order-items">
          <div className="text-left">Order Items:</div>
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                <span className="item-name fs-6">{product.prodName}</span>
                <span className="item-quantity">{product.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="order-total d-flex flex">
          <div className="fs-6 me-2 d-flex align-items-start justify-content-start flex-column">
            <div>Total Amount:</div>
            <div className="text-secondary">Rs. {totalProductsAmount}</div>
          </div>
          <div className="fs-6 me-2 d-flex align-items-start justify-content-start flex-column">
            <div>Total Weight:</div>
            <div className="text-secondary">{totalWeight} grams</div>
          </div>
          <div className="fs-6 me-2 d-flex align-items-start justify-content-start flex-column">
            <div>Delivery Charge:</div>
            <div className="text-secondary">Rs. {deliveryCharge}</div>
          </div>
          <div className="fs-6 me-2 d-flex align-items-start justify-content-start flex-column">
            <div>Status:</div>
            <div className="text-secondary">{status}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsCard;
