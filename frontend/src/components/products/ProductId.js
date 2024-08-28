import React from "react";
import { useState, useEffect } from "react";
import { FaStar, FaRupeeSign } from "react-icons/fa";
import { MdOutlineHighQuality } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
// import ProductCard from "./ProductCard"
import { Link, useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { useCart } from "react-use-cart";
import Cookies from "js-cookie";

import { baseUrl } from "../../BaseUrl";
import ProductImages from "./ProductImages";
import cartApi from "../../api/cart";
import deliveryApi from "../../api/delivery";
import { Helmet } from "react-helmet";

export default function ProductId() {
  let { productId } = useParams();
  const location = useLocation();
  const [aboutAuthorDesc, setAboutAuthorDesc] = useState(150);
  const [descLength, setDescLength] = useState(200);
  const [delivery_postcode, setDelivery_postcode] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState("");

  // const randomNumber = Math.random() * 10;
  const [indivProd, setIndivProd] = useState([]);
  const [sameProds, setSameProds] = useState([]);
  const [category, setCategory] = useState("");
  const [prodImage, setProdImage] = useState("");

  const navigate = useNavigate();

  const fetchProductData = async () => {
    const url1 = `${baseUrl}/products`;
    const response1 = await fetch(url1);
    const data1 = await response1.json();

    data1.products.forEach((prodData) => {
      if (prodData._id === productId) {
        setIndivProd(prodData);
        setProdImage(prodData.urls[0]);
        setCategory(prodData.category);
      }
    });
  };

  const fetchSimiliarProducts = async () => {
    const url2 = `${baseUrl}/products?category=${category}`;
    const response2 = await fetch(url2);
    const data2 = await response2.json();
    setSameProds(data2.products);
  };

  useEffect(() => {
    fetchProductData();
    fetchSimiliarProducts();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [productId, location]);

  const { addItem, getItem, totalItems, cartTotal, totalUniqueItems, items } =
    useCart();
  const checkItemInCart = getItem(indivProd._id);

  const addToCart = async ({ isBuynow }) => {
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

    if (isBuynow) return navigate("/cart");
  };

  // useEffect(() => {
  //   addToCart();
  // }, [totalItems]);

  // ____________________________
  useEffect(() => {
    const recentlyViewed = JSON.parse(Cookies.get("recentlyViewed") || "[]");
    const filteredRecentlyViewed = recentlyViewed.filter(
      (id) => id !== productId
    );

    filteredRecentlyViewed.unshift(productId);
    const updatedRecentlyViewed = filteredRecentlyViewed.slice(0, 5);

    Cookies.set("recentlyViewed", JSON.stringify(updatedRecentlyViewed), {
      expires: 7,
    });
  }, [productId]);

  return (
    <>
      <Helmet
        title={`${indivProd?.prodName}`}
        content={indivProd.description}
        url="/products/:productId"
      />
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-4 col-sm-6 productID-left">
            <ProductImages
              indivProd={indivProd}
              prodImage={prodImage}
              setProdImage={setProdImage}
            />

            <div className="product-buttons my-4">
              {checkItemInCart ? (
                <Link to="/cart" style={{ textDecoration: "none" }}>
                  <div className="cart-btn mx-1">Go to Cart</div>
                </Link>
              ) : (
                <div
                  className="cart-btn mx-1"
                  onClick={() => {
                    addItem({
                      id: indivProd._id,
                      price: indivProd.prodSp,
                      ...indivProd,
                    });
                    addToCart();
                  }}
                >
                  Add to Cart
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-8 col-sm-6 productID-right">
            <div className="prod_heading my-2 fs-4 px-2">
              {indivProd.prodName}
              <span className="fs-6 text-secondary"> by </span>
              {indivProd.authorName}
            </div>

            <table className=" container">
              <tbody>
                <tr>
                  <td className="col-lg-4 col-sm-6 light_text">Author</td>
                  <td className="col-lg-8 col-sm-6">
                    {indivProd.authorName ? indivProd.authorName : "NA"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* _______________ */}
            <h5 className="mt-4">Specifications </h5>
            <table className="about_product_table">
              <tbody>
                <tr>
                  <td className="col-lg-4 col-sm-6 light_text">Publisher</td>
                  <td className="col-lg-8 col-sm-6">
                    {indivProd.publisher ? (
                      <>{indivProd.publisher.split(";").join(", ")}</>
                    ) : (
                      "NA"
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="col-lg-4 col-sm-6 light_text">
                    Language Availability
                  </td>
                  <td className="col-lg-8 col-sm-6">
                    {indivProd.language ? indivProd.language : "NA"}
                  </td>
                </tr>
                <tr>
                  <td className="col-lg-4 col-sm-6 light_text">Book type </td>
                  <td className="col-lg-8 col-sm-6">
                    {indivProd.bookType ? indivProd.bookType : "NA"}
                  </td>
                </tr>
                <tr>
                  <td className="col-lg-4 col-sm-6 light_text">
                    Number of pages{" "}
                  </td>
                  <td className="col-lg-8 col-sm-6">
                    {indivProd.numOfPages ? indivProd.numOfPages : "NA"}
                  </td>
                </tr>
              </tbody>
            </table>

            {indivProd.aboutAuthor ? (
              <div>
                <div className="light_text ps-2">About Author</div>
                <div className="ps-2">
                  {indivProd.aboutAuthor
                    ? indivProd.aboutAuthor.slice(0, aboutAuthorDesc)
                    : ""}
                  {aboutAuthorDesc === 150 ? (
                    <span
                      className="read_more"
                      onClick={() => {
                        setAboutAuthorDesc(indivProd.aboutAuthor.length);
                      }}
                    >
                      ...Read more
                    </span>
                  ) : (
                    ""
                  )}
                  {aboutAuthorDesc === indivProd.aboutAuthor.length ? (
                    <span
                      className="read_more"
                      onClick={() => {
                        setAboutAuthorDesc(150);
                      }}
                    >
                      ...Read less
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )}

            {/* _______________ */}
            {indivProd.description ? (
              <div>
                <div className="light_text ps-2 mt-2">Description</div>
                <div className=" book-lines ps-2">
                  {indivProd.description.slice(0, descLength)}
                  {descLength === 200 ? (
                    <span
                      className="read_more"
                      onClick={() => {
                        setDescLength(indivProd.description.length);
                      }}
                    >
                      ...Read more
                    </span>
                  ) : (
                    ""
                  )}
                  {descLength === indivProd.description.length ? (
                    <span
                      className="read_more"
                      onClick={() => {
                        setDescLength(200);
                      }}
                    >
                      ...Read less
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )}

            {/* SIMILIAR PRODUCT LIST STARTS */}

            {/* <div className="products-list container-fluid">
              <h3 className="text-center">View Similiar products...</h3>
              <div className="products-list-body">
                {sameProds.slice(randomNumber, randomNumber + 4)?.map((p) => {
                  return (
                    <ProductCard
                      key={p._id}
                      {...p}
                      id="62c6e23f7bf811b8bbc1a309"
                      navigator={true}
                    />
                  );
                })}
              </div>
            </div> */}
            {/* SIMILIAR PRODUCT LIST ENDS */}
          </div>
        </div>
      </div>
    </>
  );
}
