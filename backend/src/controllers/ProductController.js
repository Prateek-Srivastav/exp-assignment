const Product = require("../models/product");
const getBookDetails = require("../helpers/getBookDetails");
const { default: mongoose } = require("mongoose");

class ProductController {
  // static async getProducts(req, res) {
  //   if (!req.query.category) {
  //     const products = await Product.find({
  //       inStock: true, // change this everywhere and add ui to show out of stock in frontend
  //       isDeleted: false,
  //     }).sort({ _id: -1 });

  //     if (!products || products.length === 0) return res.send("No products.");

  //     res.status(200).send({ products });
  //   } else if (req.query.category) {
  //     const products = await Product.find({
  //       category: req.query.category,
  //       inStock: true,
  //       isDeleted: false,
  //     }).sort({
  //       _id: -1,
  //     });

  //     if (!products || products.length === 0)
  //       return res.send("No products in this category.");

  //     res.status(200).send({ products });
  //   }
  // }

  static async getProducts(req, res) {
    try {
      let matchStage = {
        inStock: true,
        isDeleted: false,
      };

      if (req.query.category) {
        matchStage.category = req.query.category;
      }

      const products = await Product.aggregate([
        { $match: matchStage },
        { $sort: { _id: -1 } },
        {
          $lookup: {
            from: "users", // assuming your users collection is named 'users'
            localField: "ownerId",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $addFields: {
            ownerName: {
              $cond: {
                if: { $gt: [{ $size: "$owner" }, 0] },
                then: { $arrayElemAt: ["$owner.fullname", 0] },
                else: null,
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            price: 1,
            category: 1,
            inStock: 1,
            ownerId: 1,
            ownerName: 1,
            prodName: 1,
            authorName: 1,
            publisher: 1,
            language: 1,
            bookType: 1,
            numOfPages: 1,
            urls: 1,
            // Include other fields you want to return
          },
        },
      ]);

      if (!products || products.length === 0) {
        return res
          .status(404)
          .send(
            req.query.category
              ? "No products in this category."
              : "No products."
          );
      }
      console.log(products);
      res.status(200).send({ products });
    } catch (error) {
      console.error("Error in getProducts:", error);
      res.status(500).send("An error occurred while fetching products.");
    }
  }

  static async getProduct(req, res) {
    const productId = req.params.id;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(404)
        .send({ message: "No Product found with given ID!" });
    }

    const products = await Product.find({
      _id: productId,
    });

    res.status(200).send({ products });
    // }
  }

  static async searchedProducts(req, res) {
    if (!req.query.tags) {
      const products = await Product.find({ inStock: true, isDeleted: false });

      if (!products || products.length === 0) return res.send("No products.");

      res.status(200).send({ products });
    } else if (req.query.tags) {
      let tag = req.query.tags.toLowerCase();
      let tagArray = tag.trim().split(" ");
      let products = [];
      if (tagArray[0] !== "") {
        products = await Product.find(
          {
            inStock: true,
            isDeleted: false,
            $or: [
              { prodName: { $regex: tag, $options: "i" } },
              { authorName: { $regex: tag, $options: "i" } },
              { category: { $regex: tag, $options: "i" } },
            ],
          }
          // { tags: 0 }
        ).sort({ name: -1 });

        const sorter = (a, b) => {
          if (a.tags.length > b.tags.length) {
            return 1;
          } else {
            return -1;
          }
        };
        // products.sort(sorter);
        products.map((product) => {
          delete product.tags;
          return product;
        });
        res.send(products);
      }
    }
  }

  static async addProducts(req, res) {
    const {
      prodName,
      authorName,
      aboutAuthor,
      urls,
      description,
      prodMrp,
      prodSp,
      category,
      dimensions,
      publisher,
      numOfPages,
      bookType,
      language,
      weight,
    } = req.body;

    if (!urls || !prodName || !authorName || !description || !category)
      return res.status(400).send({ error: "Please send all details." });

    // const discount = Math.ceil(((prodMrp - prodSp) / prodMrp) * 100);

    // const tags = [
    //   ...prodName.toLowerCase().split(" "),
    //   ...authorName.toLowerCase().split(" "),
    //   ...category.toLowerCase().split(" "),
    // ];

    const product = new Product({
      prodName,
      authorName,
      urls,
      description,
      category,
      publisher,
      numOfPages,
      bookType,
      language,
      ownerId: req.user._id,
    });

    await product.save();

    res.send("Product added successfully.");
  }

  static async getBookDetails(req, res) {
    const pid = req.params.pid;
    console.log(pid);
    if (!pid) return res.status(400).send("Please enter PID.");
    const details = await getBookDetails(`https://amazon.in/dp/${pid}`);

    console.log(details);
    res.send(details);
  }
}

module.exports = ProductController;
