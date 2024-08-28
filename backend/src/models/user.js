const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

function validateUser(user) {
  const schema = Joi.object({
    fullname: Joi.string().min(2).max(50),
    email: Joi.string().email(),
  });

  return schema.validate(user);
}

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    minlength: 3,
    maxlength: 100,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    length: 10,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  otp: String,
  password: {
    type: String,
    // required: true,
  },
  isGoogleAuth: {
    type: Boolean,
    default: false,
  },
  cartItems: [
    new mongoose.Schema({
      items: [
        new mongoose.Schema({
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            // unique: true,
            match: /^[0-9a-fA-F]{24}$/,
            ref: "Product",
          },
          quantity: {
            type: Number,
            required: true,
          },
          id: mongoose.Schema.Types.ObjectId,
          price: Number,
          prodMrp: Number,
          prodSp: Number,
          aboutAuthor: String,
          authorName: String,
          bookType: String,
          category: String,
          description: String,
          discount: Number,
          height: Number,
          inStock: Boolean,
          isDeleted: Boolean,
          language: String,
          length: Number,
          numOfPages: String,
          prodName: String,
          publisher: String,
          tags: Array,
          urls: Array,
          width: Number,
          weight: String,
        }),
      ],
      cartTotal: Number,
      totalItems: Number,
      totalUniqueItems: Number,
      keptAt: {
        type: Date,
        default: Date.now,
      },
    }),
  ],
});

userSchema.methods.generateAuthToken = function (userId) {
  const token = jwt.sign(
    {
      _id: userId,
      fullname: this.fullname,
      email: this.email,
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports.validate = validateUser;
module.exports.userSchema = userSchema;
module.exports.User = User;
