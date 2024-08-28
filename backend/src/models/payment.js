const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    stripe_payment_id: {
      type: String,
      // required: true,
    },
    amount_subtotal: {
      type: Number,
      required: true,
    },
    amount_total: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["cod", "online"],
    },
    datetime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
