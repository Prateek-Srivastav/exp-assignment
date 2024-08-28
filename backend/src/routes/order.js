const express = require("express");

const auth = require("../middleware/auth");
const Product = require("../models/product");
const { Order } = require("../models/order");
const errorRespond = require("../helpers/errorRespond");
const { toInteger } = require("lodash");
const getDeliveryCharge = require("../helpers/getDeliveryCharge");
const { User } = require("../models/user");
const { orderDetailsMail } = require("../helpers/mailer");

const router = express.Router();

router.get("/:orderId", auth, async (req, res) => {
  if (req.params.orderId === "all") {
    const allOrders = await Order.find({
      buyerId: req.user._id,
      status: { $ne: "pending" },
    }).sort({ _id: -1 });

    return res.send(allOrders);
  }

  if (req.params.orderId) {
    if (req.params.orderId === "undefined")
      return errorRespond(res, 400, "invalid_order_id");

    let orderDetails = await Order.findOne({
      _id: req.params.orderId,
      buyerId: req.user._id,
    });

    let totalProdMrp = 0;
    let discount = 0;
    // let deliveryCharge;

    const productDataArray = await Promise.all(
      orderDetails.products.map(async (item) => {
        const ordered_product = await Product.findById(item.productId);

        totalProdMrp += ordered_product.prodMrp * item.quantity;

        return {
          productId: ordered_product._id.toString(),
          quantity: item.quantity,
          prodSp: ordered_product.prodSp,
          prodMrp: ordered_product.prodMrp,
          prodName: ordered_product.prodName,
          weight: ordered_product.weight,
          urls: ordered_product.urls,
        };
      })
    );

    discount = Math.floor(
      ((totalProdMrp - orderDetails.totalProductsAmount) / totalProdMrp) * 100
    );

    delete orderDetails.products;

    orderDetails = {
      ...orderDetails._doc,
      products: productDataArray,
      totalProdMrp,
      discount,
    };

    // console.log(orderDetails);

    return res.send(orderDetails);
  }
});

router.post("/new", auth, async (req, res) => {
  const { items } = req.body;

  if (items.length === 0) return errorRespond(res, 400, "no_items_to_add");

  let totalProductsAmount = 0;
  let totalWeight = 0;

  const productDataArray = await Promise.all(
    items.map(async (item) => {
      const ordered_product = await Product.findById(item.id);
      totalProductsAmount += ordered_product.prodSp * item.quantity;
      totalWeight += toInteger(ordered_product.weight.match(/\d+/g)[0]);
      return {
        productId: ordered_product._id.toString(),
        quantity: item.quantity,
        prodSp: ordered_product.prodSp,
        prodMrp: ordered_product.prodMrp,
        prodName: ordered_product.prodName,
        weight: ordered_product.weight,
      };
    })
  );

  const newOrder = new Order({
    products: productDataArray,
    buyerId: req.user._id,
    totalProductsAmount,
    totalWeight,
  });

  await newOrder.save();

  return res.send({ message: "order_added_success", orderId: newOrder._id });
});

router.put("/update", auth, async (req, res) => {
  if (!req.body.orderId || req.body.orderId === "")
    return errorRespond(res, 400, "id_not_provided");

  const order = await Order.findOne({
    _id: req.body.orderId,
    buyerId: req.user._id,
  });
  console.log(order);

  if (order.buyerId !== req.user._id)
    return errorRespond(res, 400, "user_unauthorized");

  if (req.body.address) {
    await order.updateOne({ addressDetails: req.body.address });
    return res.send({ message: "address_added_to_order", orderId: order._id });
  } else if (req.body.status) {
    await order.updateOne({ status: req.body.status });
    return res.send({ message: "order_status_updated", orderId: order._id });
  } else if (req.body.paymentMethod) {
    let deliveryCharge = 0;

    if (req.body.paymentMethod === "cod")
      deliveryCharge = await getDeliveryCharge({
        delivery_postcode: order.addressDetails.pincode,
        itemsWeight: order.totalWeight,
      });

    await order.updateOne({
      paymentMethod: req.body.paymentMethod,
      deliveryCharge,
    });
    return res.send({ message: "payment_method_updated", orderId: order._id });
  }
});

module.exports = router;
