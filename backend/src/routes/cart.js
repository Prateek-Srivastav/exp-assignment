const express = require("express");
const _ = require("lodash");
// const { deliveryChargeCalculate } = require("../utilities/deliveryCharge");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const Product = require("../models/product");
const errorRespond = require("../helpers/errorRespond");

const router = express.Router();

router.put("/add", auth, async (req, res) => {
  if (!req.user._id.match(/^[0-9a-fA-F]{24}$/))
    return res.status(404).send("invalid user id");

  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).send({ message: "no user found with given id" });

  await user.updateOne(
    {
      cartItems: req.body,
    },
    { upsert: true }
  );

  // console.log(req.body);

  res.send({ message: "added to cart successfully" });
});

router.get("/get", auth, async (req, res) => {
  if (!req.user._id.match(/^[0-9a-fA-F]{24}$/))
    return res.status(404).send("invalid user id");
  //if (!req.body.items.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(404).send('invalid item id');
  let user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).send({ message: "no user found with given id" });

  if (user.cartItems.length === 0)
    return res.status(404).send({ message: "Empty cart." });
  else {
    for (index in user.cartItems) {
      for (itemIndex in user.cartItems[index].items) {
        let item = await Product.findById(
          user.cartItems[index].items[itemIndex].productId
        );

        if (user.cartItems[index].items.length === 1 && item.isDeleted) {
          await user.updateOne(
            {
              cartItems: [],
            },
            { upsert: true }
          );

          return res.send({ message: "Empty Cart." });
        }
        // console.log(item);
        user.cartItems[index].items[itemIndex] = {
          quantity: user.cartItems[index].items[itemIndex].quantity,
          // prodMrp: item.prodMrp,
          id: item._id,
          price: item.prodSp,
          ..._.pick(item, [
            "weight",
            "prodName",
            "prodSp",
            "prodMrp",
            "authorName",
            "aboutAuthor",
            "bookType",
            "category",
            "description",
            "discount",
            "height",
            "language",
            "length",
            "numOfPages",
            "publisher",
            "tags",
            "urls",
            "width",
            "thumbnailUrl",
            "inStock",
            "isDeleted",
            "_id",
          ]),
        };
      }
    }

    res.send(user.cartItems);
  }
});

router.delete("/remove", auth, async (req, res) => {
  if (!req.query.productId)
    return errorRespond(res, 400, "Please provide Product ID.");

  if (!req.query.productId.match(/^[0-9a-fA-F]{24}$/))
    return errorRespond(res, 404, "invalid item id");

  if (!req.user._id.match(/^[0-9a-fA-F]{24}$/))
    return errorRespond(res, 404, "invalid user id");

  const user = await User.findById(req.user._id);
  if (!user) return errorRespond(res, 400, "no user found with given id");

  const item = user.cartItems[0].items.find(
    (item) => item.id.toString() === req.query.productId
  );
  const index = user.cartItems[0].items.indexOf(item);

  // code for testing
  console.log(index);
  console.log(user.cartItems[0].items[index]);
  //--------//

  user.cartItems[0].items.splice(index, 1);
  await user.updateOne({ cartItems: user.cartItems });
  res.send({ message: "removed product from cart." });
});

module.exports = router;
