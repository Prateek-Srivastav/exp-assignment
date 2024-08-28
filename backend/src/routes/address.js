const express = require("express");
const { Address } = require("../models/address");
const auth = require("../middleware/auth");
const router = express.Router();

router.put("/add", auth, async (req, res) => {
  const {
    name,
    phoneNumber,
    area_street_colony,
    pincode,
    city,
    state,
    house_flat_no,
  } = req.body;

  const newAddressDetails = {
    name,
    phoneNumber,
    house_flat_no,
    area_street_colony,
    pincode,
    city,
    state,
  };

  let address = await Address.findOne({ userId: req.user._id });

  if (address) {
    await address.updateOne({
      addressDetails: [...address.addressDetails, newAddressDetails],
    });

    return res.send({
      message: "address_added_successfully",
      addressId: address._id,
    });
  }

  address = new Address({
    userId: req.user._id,
    addressDetails: [newAddressDetails],
  });

  await address.save();

  res.send({
    message: "new_address_added_successfully",
    addressId: address._id,
  });
});

router.get("/", auth, async (req, res) => {
  const addresses = await Address.findOne({ userId: req.user._id });

  return res.send({ message: "address_fetched", addresses });
});

module.exports = router;
