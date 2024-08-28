const { required } = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  prodName: {
    type: String,
    required: true,
    minlength: 3,
    // maxlength: 100,
  },
  authorName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  aboutAuthor: {
    type: String,
    minlength: 150,
  },
  urls: {
    type: Array,
    required: true,
  },
  thumbnailUrl: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  prodMrp: {
    type: Number,
    // required: true,
    min: 0,
  },
  prodSp: {
    type: Number,
    // required: true,
    min: 0,
  },
  discount: {
    type: Number,
    // required: true
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    ref: "Category",
  },
  weight: {
    type: String,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // height: {
  //   type: Number,
  // },
  // length: {
  //   type: Number,
  // },
  // width: {
  //   type: Number,
  // },
  dimensions: String,
  publisher: String,
  numOfPages: String,
  language: String,
  bookType: String,
  // tags: Array,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
