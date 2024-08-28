const jwt = require("jsonwebtoken");
const errorRespond = require("../helpers/errorRespond");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    req.user = decoded;
    next();
  } catch (ex) {
    console.log("invalid");
    errorRespond(res, 400, "Invalid token.");
  }
};
