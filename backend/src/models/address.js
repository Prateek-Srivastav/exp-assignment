const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: String,
  addressDetails: {
    type: [
      {
        name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 50,
          unique: true,
        },
        phoneNumber: {
          type: Number,
          required: true,
          length: 10,
        },
        house_flat_no: {
          type: String,
          required: true,
        },
        area_street_colony: {
          type: String,
          required: true,
        },
        pincode: {
          type: Number,
          required: true,
          length: 6,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
      },
    ],
    required: true,
  },
});

const Address = mongoose.model("Address", addressSchema);

module.exports.addressSchema = addressSchema;
module.exports.Address = Address;
