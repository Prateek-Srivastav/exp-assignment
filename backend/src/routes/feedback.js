const express = require("express");
const router = express.Router();
const { Feedback } = require("../models/feedback");
const errorRespond = require("../helpers/errorRespond");

router.post("/", async (req, res) => {
  const { prodFeedback, suggestions, ratings } = req.body;
    if (!prodFeedback) return errorRespond(res, 400, "Product feedback is required!");
    else if (!ratings) return errorRespond(res, 400, "Please provide your ratings!");
    const feedback = new Feedback({
        prodFeedback:prodFeedback,
        suggestions:suggestions,
        ratings:ratings,
    })
    await feedback.save();
    res.send({message :"Thanks for your feedback!"})
}
);

module.exports = router;
 