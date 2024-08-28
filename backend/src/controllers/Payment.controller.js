const Product = require("../models/product");
const Payment = require("../models/payment");
const { User } = require("../models/user");
const { Order } = require("../models/order");
const errorRespond = require("../helpers/errorRespond");
const { orderDetailsMail } = require("../helpers/mailer");
const stripe = require("stripe")(process.env.STRIPE_LIVE_SECRET_KEY);

class PaymentController {
  static async createPayment(req, res) {
    try {
      if (!req.body.orderId)
        return errorRespond(res, 400, "no_order_id_provided");

      const payment = await Payment.findOne({
        userId: req.user._id,
        orderId: req.body.orderId,
      });
      if (payment) return errorRespond(res, 400, "payment_session_exists");

      const user = await User.findById(req.user._id);
      const order = await Order.findOne({
        _id: req.body.orderId,
        buyerId: req.user._id,
      });

      if (!order || order?.length === 0)
        return errorRespond(res, 400, "no_order_found");

      if (order.paymentMethod === "online") {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items: await Promise.all(
            order.products.map(async (item) => {
              const ordered_product = await Product.findById(item.productId);
              return {
                price_data: {
                  currency: "INR",
                  product_data: {
                    name: ordered_product.prodName,
                  },
                  unit_amount: ordered_product.prodSp * 100,
                },
                quantity: item.quantity,
              };
            })
          ),
          success_url: `${process.env.UI_ROOT_URI}/#/payment/success`,
          cancel_url: `${process.env.UI_ROOT_URI}/#/payment/cancel`,
        });

        if (!session)
          return res
            .status(500)
            .json({ message: "No stripe session created!" });
        // console.log(session, "session");

        const payment = new Payment({
          userId: req.user._id,
          stripe_payment_id: session.id,
          amount_subtotal: session.amount_subtotal / 100,
          amount_total: session.amount_total / 100,
          orderId: req.body.orderId,
          payment_status: session.payment_status,
          datetime: session.created,
          payment_method: order.paymentMethod,
        });
        await payment.save();

        await order.updateOne({ paymentId: payment._id });

        return res.json({
          message: "payment_session_created",
          url: session.url,
          stripe_payment_id: session.id,
        });
      } else if (order.paymentMethod === "cod") {
        const payment = new Payment({
          userId: req.user._id,
          // stripe_payment_id: session.id,
          amount_subtotal: order.totalProductsAmount,
          amount_total: order.totalProductsAmount + order.deliveryCharge,
          orderId: req.body.orderId,
          payment_status: "unpaid",
          datetime: new Date(),
          payment_method: order.paymentMethod,
        });
        await payment.save();

        await order.updateOne({ paymentId: payment._id, status: "success" });

        await user.updateOne({
          cartItems: [],
        });

        orderDetailsMail({
          name: user.fullname,
          email: user.email,
          orderDetails: order,
        });

        return res.send({
          message: "payment_session_created",
          paymentId: payment._id,
        });
      }
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  }

  //UPDATING PAYMENT STATUS WITH WEBHOOKS
  static async getPaymentStatus(req, res) {
    try {
      const payload = req.body;
      const sig = req.headers["stripe-signature"];

      const event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.WH_ENDPOINT_SECRET
      );

      const paymentId = event.data.object.id;
      const paymentStatus = event.data.object.payment_status;

      const payment = await Payment.findOne({ stripe_payment_id: paymentId });
      const order = await Order.findOne({ paymentId: payment._id });
      const user = await User.findById(order.buyerId);

      if (!payment)
        return res.status(404).json({ message: "No payment record found!" });
      if (!order)
        return res.status(404).json({ message: "No order record found!" });

      await payment.updateOne({ payment_status: paymentStatus });
      await order.updateOne({
        status: paymentStatus === "paid" ? "success" : "pending",
      });

      orderDetailsMail({
        name: user.fullname,
        email: user.email,
        orderDetails: order,
      });

      res.sendStatus(200);
    } catch (error) {
      console.error("Webhook error:", error.message);
      res.sendStatus(400);
    }
  }
}

module.exports = PaymentController;
