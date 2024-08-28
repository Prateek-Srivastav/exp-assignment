const axios = require("axios");
const express = require("express");

const getDeliveryCharge = require("../helpers/getDeliveryCharge");

const router = express.Router();

router.post("/getDetails", async (req, res) => {
  const { delivery_postcode, weight } = req.body;

  let itemsWeight = weight.match(/\d+/g)[0];

  const deliveryCharge = await getDeliveryCharge({
    delivery_postcode,
    itemsWeight,
  });

  res.status(200).send({ deliveryCharge });
});

module.exports = router;
