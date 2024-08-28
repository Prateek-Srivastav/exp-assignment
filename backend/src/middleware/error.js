module.exports = function (err, req, res, next) {
  res.status(500).send({
    message: "Something went wrong on our side.",
    error: err.message,
  });
  console.error(err.message, err);
};
