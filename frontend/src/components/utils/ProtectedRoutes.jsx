import { useLocation, Navigate, Outlet } from "react-router-dom";

import useToken from "../../hooks/useToken";
import { useCart } from "react-use-cart";
import { useEffect } from "react";
import cartApi from "../../api/cart";

export function ProtectedRoutes() {
  const { token } = useToken();
  const location = useLocation();

  const { setItems, items } = useCart();

  const getCart = async () => {
    const res = await cartApi.getCart();
    // setItems([...res.data[0].items, ...items]);
    setItems(res.data[0].items);
  };

  useEffect(() => {
    getCart();
  }, []);

  return token ? (
    <>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}
