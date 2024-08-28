const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");

router.get("/", async (req, res) => {
  const categories = await Category.find();
  if (!categories) return res.send("No categories.");

  res.status(200).send({ categories });
});

router.post("/add", async (req, res) => {
  try {
    const categories = [
      "academics",
      "competitive",
      "fiction",
      "loveRomance",
      "fantasy",
      "lifestyleNutrition",
      "selfHelp",
      "motivation",
      "scienceFiction",
      "mystery",
      "thriller",
      "history",
      "poetryProse",
      "spiritual",
      "biography",
      "comics",
      "youngAdults",
    ];

    categories.forEach(async (cat) => {
      const category = new Category({ name: cat });

      await category.save();
    });
    res.send("added categories");
  } catch (error) {}
});

module.exports = router;
