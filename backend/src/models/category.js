const mongoose = require("mongoose");
const Joi = require("joi");

function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    // url: Joi.string().min(3).max(50).required(),
    // thumbnailUrl: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(category);
}

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  url: String,
  thumbnailUrl: String,
});

const Category = mongoose.model("Category", categorySchema);

module.exports.validate = validateCategory;
module.exports.categorySchema = categorySchema;
module.exports.Category = Category;
