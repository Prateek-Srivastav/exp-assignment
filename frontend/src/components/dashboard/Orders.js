import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import orderApi from "../../api/order";
import useToken from "../../hooks/useToken";
import { useLocation, useNavigate } from "react-router-dom";
import OrderDetailsCard from "./orderDetails/OrderDetailsCard";
import { Helmet } from "react-helmet";

export default function Orders() {
  const [my_orders, setMy_orders] = useState([]);
  const {
    data: orderData,
    request: getOrder,
    error,
    loading,
  } = useApi(orderApi.getOrder);
  const navigate = useNavigate();
  const { token } = useToken();
  const location = useLocation();

  async function getAllOrders() {
    if (!token)
      return navigate("/login", { state: { from: location.pathname } });

    try {
      await getOrder("all");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAllOrders();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      setMy_orders(orderData);
      console.log(orderData);
    } else if (error) return console.log(orderData.message);
  }, [orderData, loading, error]);

  return (
    <>
      <Helmet title="My Orders" url="/orders" />
      <div className="container text-center p-5 fs-5">
        {my_orders
          ? my_orders.map((item, index) => {
              return <OrderDetailsCard key={index} order={item} />;
            })
          : "No Orders Found!"}
      </div>
    </>
  );
}
