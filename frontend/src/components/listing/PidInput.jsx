import axios from "axios";
import React, { useState } from "react";

import { TextInput } from "./components/TextInput";
import AddProd from "./AddProd";

const PidInput = () => {
  const [pid, setPid] = useState();
  const [details, setDetails] = useState();
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    const res = await axios
      .get(`http://localhost:8000/api/products/getBookDetails/${pid}`)
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });

    setLoading(false);
    setDetails(res.data);
    console.log(res.data);
  };

  return (
    <>
      {/* <div className="flex flex-col justify-center items-center border border-cyan-700 text-white bg-[#175b6e] font-body p-5 rounded  ">
        <TextInput title="Enter PID" setInput={setPid} value={pid} />
        <button
          className={`  w-full mt-5 rounded py-2 font-body text-lg ${
            loading
              ? "bg-gray-500"
              : "bg-cyan-900 border border-cyan-500 hover:bg-cyan-400 active:scale-[.98]"
          }  duration-200 shadow-xl`}
          onClick={submitHandler}
          disabled={loading}
        >
          SUBMIT
        </button>
      </div> */}

      <AddProd details={details} setDetails={setDetails} />
    </>
  );
};

export default PidInput;
