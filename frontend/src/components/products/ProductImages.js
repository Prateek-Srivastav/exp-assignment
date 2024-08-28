import React from "react";
import Loader from "../loader/Loader";

export default function ProductImages({ indivProd, prodImage, setProdImage }) {
  return (
    <>
      {indivProd.urls ? (
        <div
          className="col-md-auto d-flex align-items-center justify-content-center rounded rounded-lg"
          style={{ height: "50vh", width: "100%", overflow: "auto" }}
        >
          <img
            style={{ aspectRatio: "auto" }}
            src={prodImage}
            alt="BookImage"
          />
        </div>
      ) : (
        <Loader type="dots" />
      )}

      <div
        className="d-flex flex-row p-1 d-flex align-items-center justify-content-center"
        style={{ width: "100%", overflowX: "auto" }}
      >
        {indivProd.urls &&
          indivProd.urls.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  setProdImage(item);
                }}
                style={{
                  width: "50px",
                  height: "55px",
                  backgroundColor: "rgb(250, 250, 250)",
                  overflow: "hidden",
                }}
                className={`${
                  item === prodImage
                    ? " shadow-sm border border-2 border-warning rounded mx-1 d-flex align-items-center justify-content-center p-1"
                    : "rounded mx-1 d-flex align-items-center justify-content-center p-1"
                }`}
              >
                <img
                  src={item}
                  alt="img"
                  style={{ height: "45px", width: "auto" }}
                />
              </div>
            );
          })}
      </div>
    </>
  );
}
