const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    prodFeedback: {
    type: String,
    required: true,
    minlength: 10,
    // maxlength: 100,
  },
  suggestions: {
    type: String,
    minlength: 2,
    maxlength: 50,
  },
  ratings: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports.Feedback = Feedback;
