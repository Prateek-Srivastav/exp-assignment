require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const winston = require("winston");
const cors = require("cors");
require("express-async-errors");
const error = require("./src/middleware/error");
const cookieParser = require("cookie-parser");
require("colors");
const htmlPage = require("./HTMLPage");
const cron = require("node-cron");

if (!process.env.DB) {
  console.error("!!FATAL ERROR!! Database not connected.");
  process.exit(1);
}

const productRouter = require("./src/routes/products.routes");
const categoryRouter = require("./src/routes/categories");
const authRouter = require("./src/routes/auth");
const cartRouter = require("./src/routes/cart");
const feedbackRouter = require("./src/routes/feedback");
const deliveryRouter = require("./src/routes/delivery");
const paymentRouter = require("./src/routes/payment.routes");
const addressRouter = require("./src/routes/address");
const orderRouter = require("./src/routes/order");

const app = express();

const corsOptions = {
  origin: [
    process.env.UI_ROOT_URI,
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use("/api/payment", paymentRouter);
app.use(express.json());

app.get("/", (req, res) => {
  if (req.hostname === "localhost" || req.hostname === "127.0.0.1")
    res.send(htmlPage);
  else res.redirect(process.env.UI_ROOT_URI);
});

app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", cartRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/delivery", deliveryRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.use(error);

winston.configure({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.printf((info) => `${info.level}: ${info.message}`)
      ),
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

mongoose
  .set("strictQuery", true)
  .connect(process.env.DB)
  .then(() => winston.info("Mongo connected ".brightMagenta + "✔ ".brightGreen))
  .catch((err) => console.error(err.message, err));

const port = process.env.PORT || 8000;
app.listen(port, () =>
  winston.info(`Server started on port ${port}`.brightBlue + " ❣".brightRed)
);

// call to backend api every 14 minutes to prevent the server from sleeping
cron.schedule("*/10 * * * *", async () => {
  await fetch(`${process.env.SERVER_ROOT_URI}/api/categories`);
  console.log("A");
});
