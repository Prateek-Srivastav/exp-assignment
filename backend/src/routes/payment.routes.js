const express = require("express");
const bodyParser = require("body-parser");

const PaymentController = require("../controllers/Payment.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router
  .route("/create-checkout-session")
  .post(express.json(), auth, PaymentController.createPayment);
router
  .route("/webhook")
  .post(
    bodyParser.raw({ type: "application/json" }),
    PaymentController.getPaymentStatus
  );

module.exports = router;
