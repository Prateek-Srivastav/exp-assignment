import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ProductHandler from "../../../api/products";
import useApi from "../../../hooks/useApi";
import Loader from "../../loader/Loader";
import RecentCard from "./RecentCard";

const RecentlyViewed = () => {
  const [recentProdID, setRecentProdId] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  console.log(recentProdID, "recentProd cookies");

  useEffect(() => {
    const recentlyViewedFromCookie = JSON.parse(
      Cookies.get("recentlyViewed") || "[]"
    );
    setRecentProdId(recentlyViewedFromCookie);
  }, []);

  const {
    data: prodData,
    res: prodResp,
    loading,
    error,
    request: getAllProducts,
    networkError,
  } = useApi(ProductHandler.getAllProducts);

  const fetchRecentlyViewedDetails = async () => {
    try {
      await getAllProducts();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecentlyViewedDetails();
  }, []);

  useEffect(() => {
    if (!error && !loading && prodResp && !networkError && prodData) {
      console.log(prodData, "prodData");
      const recentProdsFinal = prodData?.products?.filter((product) =>
        recentProdID.includes(product._id)
      );
      setRecentlyViewed(recentProdsFinal);
    }
  }, [error, loading, prodData, prodResp, networkError, recentProdID]);

  return (
    <>
      {recentProdID.length > 0 && (
        <div className="container my-5">
          <div className="fs-2 mb-4 text-center">Recently Viewed</div>
          {!loading ? (
            <div className="d-flex flex-wrap items-center justify-content-center w-full">
              {recentlyViewed &&
                recentlyViewed.map((product, idx) => {
                  return <RecentCard key={idx} product={product} />;
                })}
            </div>
          ) : (
            <div className="d-flex items-center justify-content-center">
              <Loader type="dots" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RecentlyViewed;
