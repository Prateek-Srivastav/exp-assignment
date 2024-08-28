const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          productId: {
            type: String,
            required: true,
          },
          prodName: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          prodSp: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    addressDetails: {
      type: Object,
    },
    totalProductsAmount: {
      type: Number,
      required: true,
    },
    totalWeight: Number,
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "success", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports.Order = Order;
