import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

import Dropdown from "./components/DropDown";
import { TextInput } from "./components/TextInput";
import useToken from "../../hooks/useToken";

const AddProd = ({ details, setDetails }) => {
  // const { title, bookDescription, price, numberOfPages } = details;

  const [image, setImage] = useState();
  const [imageUrls, setImageUrls] = useState([]);
  const [uploadedImgUrls, setUploadedImgUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [prodName, setProdName] = useState(details?.title);
  const [authorName, setAuthorName] = useState(details?.authorName);
  const [aboutAuthor, setAboutAuthor] = useState(details?.aboutAuthor);
  const [description, setDescription] = useState(details?.bookDescription);
  const [prodMrp, setprodMrp] = useState(details?.price);
  const [prodSp, setprodSp] = useState();
  const [weight, setWeight] = useState(details?.weight);
  // const [height, setHeight] = useState();
  // const [length, setLength] = useState();
  // const [width, setWidth] = useState();
  const [dimensions, setDimensions] = useState(details?.dimensions);
  const [publisher, setPublisher] = useState(details?.publisher);
  const [numOfPages, setNumOfPages] = useState(details?.numberOfPages);
  const [language, setLanguage] = useState(details?.language);
  const [category, setCategory] = useState();
  const [categoriesArray, setCategoriesArray] = useState([]);
  const [bookType, setBookType] = useState();
  const [bookTypeArray, setBookTypeArray] = useState([
    "Hardcover",
    "Paperback",
  ]);

  const { token } = useToken();

  const getCategories = async () => {
    const res = await axios.get("http://localhost:8000/api/categories");

    const catArray = res.data.categories.map((cat) => cat.name);

    setCategoriesArray(catArray);

    return res;
  };

  const clearFields = () => {
    setImage();
    setUploadCount();
    setAboutAuthor("");
    setAuthorName("");
    setCategory("");
    setDescription("");
    setDimensions("");
    setWeight("");
    setProdName("");
    setprodMrp("");
    setprodSp("");
    setImageUrls("");
    setBookType("");
    setNumOfPages("");
    setPublisher("");
    setLanguage("");
  };

  useEffect(() => {
    getCategories();
  }, []);

  const uploadImages = async ({ imageUrl, index }) => {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const reader = new FileReader();
    reader.readAsDataURL(new Blob([response.data]));

    const result = await new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });

    // The result is a base64-encoded data URL
    const base64Data = result;
    console.log(`Image ${index} downloaded and saved to a local file`);

    const formData = new FormData();
    formData.append("file", base64Data);
    formData.append("upload_preset", "rik1sh9y");

    const imgRes = await axios.post(
      "https://api.cloudinary.com/v1_1/dkpwfe15i/image/upload",
      formData
    );

    const url = imgRes.data.url;

    URL.revokeObjectURL(base64Data);

    return url;
  };

  useEffect(() => {
    setUploadProgress((uploadedImgUrls.length / imageUrls?.length) * 100);
  }, [uploadCount]);

  const submitHandler = async () => {
    if (
      !imageUrls ||
      !prodName ||
      !authorName ||
      !description ||
      !category ||
      !publisher ||
      !numOfPages ||
      !bookType ||
      !language
    )
      return alert("Please fill all details.");

    setUploading(true);

    (async () => {
      for (let i = 0; i < imageUrls?.length; i++) {
        const imageUrl = imageUrls[i];
        setUploadCount(i + 1);
        const uploadedUrl = await uploadImages({ imageUrl, index: i });
        uploadedImgUrls.push(uploadedUrl);
      }
      console.log("All images uploaded");
      setUploadProgress(100);

      const body = {
        prodName,
        authorName,
        aboutAuthor,
        urls: uploadedImgUrls,
        description,
        prodMrp,
        prodSp,
        category,
        dimensions,
        publisher,
        numOfPages,
        bookType,
        language,
      };

      console.log(body);
      const res = await axios
        .post("http://localhost:8000/api/products/add", body, {
          headers: { Authorization: "Bearer " + token },
        })
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

      setTimeout(() => {
        setUploading(false);
        if (res.statusText === "OK") {
          setUploadProgress(0);
          clearFields();
          clearFileInput();
          // alert("Product added successfully.");
          return setDetails();
        } else return alert(res.data.error);
      }, 2000);
    })();
  };

  const fileInput = useRef(null);

  const clearFileInput = () => {
    fileInput.current.value = "";
    setImageUrls();
  };

  return (
    <div className="flex flex-col justify-center items-center border bg-teal-50  border-cyan-700   font-body p-5 rounded  ">
      <h2 className="text-3xl font-medium self-start mb-5">ADD BOOK</h2>
      <div className=" m-0 p-0 w-full ">
        <div className="sm:flex justify-between space-x-8">
          <TextInput
            title="Book Name"
            setInput={setProdName}
            value={prodName}
          />
          <TextInput
            title="Author Name"
            setInput={setAuthorName}
            value={authorName}
          />
        </div>

        {/* <h3>About Author</h3>
        <textarea
          type="text"
          rows={6}
          className={"w-full  rounded outline-none p-2 text-green-800 mb-3"}
          onChange={(e) => setAboutAuthor(e.target.value)}
          value={aboutAuthor}
        /> */}
        <h3>Book Description</h3>
        <textarea
          type="text"
          rows={6}
          className="w-full bg-teal-100 rounded outline-none p-2 text-green-800 mb-3"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        {/* <div className="flex justify-between space-x-8">
          <TextInput
            title="Product MRP"
            // type={"number"}
            setInput={setprodMrp}
            value={prodMrp}
          />
          <TextInput
            title="Product SP"
            // type={"number"}
            setInput={setprodSp}
            value={prodSp}
          />
          <TextInput
            title="Weight(in kg)"
            // type={"number"}
            setInput={setWeight}
            value={weight}
          />
        </div> */}

        <div className="sm:flex sm:space-x-8">
          <TextInput
            title="Publisher"
            setInput={setPublisher}
            value={publisher}
          />
          <TextInput
            title="Enter Language(first letter capital)"
            setInput={setLanguage}
            value={language}
          />
          {/* <div className="flex sm:flex-none sm:w-1/2"> */}
          <TextInput
            title="No. of Pages"
            // type={"number"}
            setInput={setNumOfPages}
            value={numOfPages}
          />
          {/* </div> */}
        </div>

        <div className="flex justify-between w-full space-x-8">
          <div>
            <h3>Select Category</h3>
            <Dropdown setOption={setCategory} array={categoriesArray} />
          </div>
          <div className="w-full">
            <h3>Select Book Type</h3>
            <Dropdown setOption={setBookType} array={bookTypeArray} />
          </div>

          <div className="w-[15rem]">
            <h3>Add Images</h3>
            <input
              type="file"
              ref={fileInput}
              onChange={(e) => {
                setImage(e.target.files[0]);
                setImageUrls([
                  ...imageUrls,
                  URL.createObjectURL(e.target.files[0]),
                ]);
              }}
            />
            <button type="button" onClick={clearFileInput}>
              Clear
            </button>
          </div>
        </div>
        <div className="flex flex-wrap space-x-5 space-y-5 justify-center items-center">
          {imageUrls?.map((url) => (
            <img src={url} alt="" className="w-56" />
          ))}
        </div>
      </div>
      {uploading && (
        <>
          <div className="w-full bg-[#083440] my-5 rounded-full">
            <div
              className={`py-1 w-full bg-cyan-400 rounded-full duration-200`}
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div>{uploadProgress === 100 ? "Uploaded" : "Uploading..."}</div>
        </>
      )}
      <button
        className={`  w-full my-5 rounded py-3 font-body text-lg ${
          uploading
            ? "bg-gray-500"
            : "bg-cyan-200 border border-cyan-500 hover:bg-cyan-400 active:scale-[.98]"
        }  duration-200 shadow-xl`}
        onClick={submitHandler}
        disabled={uploading}
      >
        SUBMIT
      </button>
    </div>
  );
};

export default AddProd;
