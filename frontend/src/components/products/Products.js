import React from "react";
import { useState, useEffect } from "react";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { Outlet, useSearchParams } from "react-router-dom";
import Loader from "../loader/Loader";
import ProductCard from "./ProductCard";
import "./Products.css";
import ProductSidebar from "./ProductSidebar";
import { baseUrl } from "../../BaseUrl";
import { Helmet } from "react-helmet";

export default function Products() {
  const [searchParam] = useSearchParams();
  const categoryParam = searchParam.get("category");
  // console.log(categoryParam);
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState([]);

  const fetchProducts = async (val) => {
    const url = !val
      ? `${baseUrl}/products`
      : `${baseUrl}/products?category=${val}`;
    setLoading(true);
    const response = await fetch(url);
    const data = await response.json();
    setDatas(data.products);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(categoryParam);
  }, [categoryParam]);

  const handleScroll = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Helmet
        title={`${categoryParam ? categoryParam : "All"} books`}
        url="/products"
      />
      <Outlet />

      <div className="products-page">
        {/* SIDEBAR STARTS  */}
        <div className="products-sidebar">
          <ProductSidebar
            returnCategory={fetchProducts}
            categoryParam={categoryParam}
          />
        </div>
        {/* SIDEBAR ENDS  */}

        {/* PRODUCT LIST STARTS */}
        <div className="products-list container-fluid">
          <div className="products-list-body">
            {!loading ? (
              datas.map((items, index) => {
                return (
                  <div key={index}>
                    <ProductCard {...items} navigator={false} />
                  </div>
                );
              })
            ) : (
              <Loader type="dots" />
            )}
          </div>
        </div>
        {/* PRODUCT LIST ENDS */}
      </div>

      <div className="scroll-top" onClick={handleScroll}>
        <FaArrowAltCircleUp color="#00899B" />{" "}
      </div>
    </>
  );
}
