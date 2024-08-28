const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const auth = require("../middleware/auth");

router.route("/").get(ProductController.getProducts);
// router.route("/:id").get(ProductController.getProduct);
router.route("/search").get(ProductController.searchedProducts);
router.route("/add").post(auth, ProductController.addProducts);
router.route("/getBookDetails/:pid").get(ProductController.getBookDetails);

module.exports = router;
