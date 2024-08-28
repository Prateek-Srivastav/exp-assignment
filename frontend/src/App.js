import React, { useEffect, useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  // useLocation,
} from "react-router-dom";
import {
  CartProvider,
  //  useCart
} from "react-use-cart";

import Navbar from "./components/navbar/Navbar";
import Products from "./components/products/Products";
import ProductId from "./components/products/ProductId";
import Error from "./components/error/Error";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Cart from "./components/cart/Cart";
import Dashboard from "./components/dashboard/Dashboard";
import Orders from "./components/dashboard/Orders";
import Security from "./components/dashboard/Security";
import "./index.css";
import useToken from "./hooks/useToken";
import { ProtectedRoutes } from "./components/utils/ProtectedRoutes";
import authApi from "./api/auth";
import CartDataContext from "./hooks/CartContext";
import PidInput from "./components/listing/PidInput";
// import { checkCookieAndExecuteAction } from "./components/utils/checkCookie";

function App() {
  const { name, token, setName, setToken } = useToken();
  // const { state } = useLocation();
  const [cartData, setCartData] = useState([]);

  const cookieValue = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("auth_token"))
    ?.split("=")[1];

  const fetchData = async () => {
    const res = await authApi.getUser(cookieValue);
    setName(res.data.user.fullname);
    setToken(res.data.token);
    return window.location.reload();
  };

  useEffect(() => {
    if (!token) fetchData();
    // checkCookieAndExecuteAction("auth_token", fetchData, 5000).then((r) =>
    //   console.log(r)
    // );
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <CartProvider>
        <CartDataContext.Provider value={{ cartData, setCartData }}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/">
                <Route index element={<Products />} />
                <Route path=":productId" element={<ProductId />} />
                <Route path="*" element={<Products />} />
              </Route>
              <Route path="*" element={<Error />} />
              {/* <Route path="/" element={<HomePage />} /> */}
              <Route path="/cart" element={<Cart />} />

              {!token && (
                <>
                  <Route
                    path="/login"
                    element={
                      token ? <Navigate to="/dashboard" replace /> : <Login />
                    }
                  />
                  <Route path="/signup" element={<Register />} />
                </>
              )}
              <Route element={<ProtectedRoutes />}>
                <Route
                  path="/listing"
                  element={
                    token ? (
                      <PidInput />
                    ) : (
                      <Navigate to="/login" replace={true} />
                    )
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    token ? (
                      <Dashboard />
                    ) : (
                      <Navigate to="/login" replace={true} />
                    )
                  }
                />
                <Route
                  path="/dashboard/orders"
                  element={
                    token ? <Orders /> : <Navigate to="/login" replace={true} />
                  }
                />
                <Route
                  path="/dashboard/security"
                  element={
                    token ? (
                      <Security />
                    ) : (
                      <Navigate to="/login" replace={true} />
                    )
                  }
                />
              </Route>
            </Routes>
          </Router>
        </CartDataContext.Provider>
      </CartProvider>
    </>
  );
}

export default App;
