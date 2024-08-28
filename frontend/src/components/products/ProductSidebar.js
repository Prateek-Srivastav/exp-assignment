import React from "react";
import { useState, useEffect } from "react";
import { baseUrl } from "../../BaseUrl";
import { Link, useSearchParams } from "react-router-dom";

export default function ProductSidebar(props) {
  const [searchParam, setSearchParams] = useSearchParams();
  const categoryParam = searchParam.get("category");

  const [active, setActive] = useState("");
  const [prodCategory, setProdCategory] = useState([]);

  const fetchCategories = async () => {
    const urlCat = `${baseUrl}/categories`;
    const catResponse = await fetch(urlCat);
    const catList = await catResponse.json();
    setProdCategory(catList.categories);
  };
  useEffect(() => {
    fetchCategories();
    window.scrollTo(0, 0);
  }, [active]);

  const handleCategory = (e) => {
    setActive(e.target.id);
    props.returnCategory(e.target.id);
  };

  const dummyCategories = [
    "Comics",
    "Academics",
    "Competitive",
    "Fantasy",
    "LifestyleNutrition",
    "SelfHelp",
    "Motivation",
    "ScienceFiction",
    "Mystery",
    "Thriller",
    "History",
    "PoetryProse",
    "Spiritual",
    "Fiction",
    "LoveRomance",
    "Biography",
    "YoungAdults",
  ];
  return (
    <>
      <div className="sidebar-body">
        <ul className="sidebar-ul">
          <div
            className={`sidebar-li ${categoryParam === "" ? "active" : ""}`}
            onClick={() => setSearchParams({ category: "" })}
          >
            All
          </div>
          {prodCategory.length > 0
            ? prodCategory?.map((c) => {
                return (
                  <Link
                    to={`/?category=${c.name}`}
                    key={c._id}
                    className={`sidebar-li ${
                      c.name === categoryParam ? "active" : ""
                    }`}
                    id={c.name}
                    onClick={(e) => {
                      handleCategory(e);
                    }}
                  >
                    {c.name}
                  </Link>
                );
              })
            : dummyCategories.map((d) => {
                return (
                  <li
                    key={d}
                    className={`sidebar-li ${d === active ? "active" : ""}`}
                    id={d}
                    onClick={(e) => {
                      handleCategory(e);
                    }}
                  >
                    {d}
                  </li>
                );
              })}
        </ul>
      </div>
    </>
  );
}
