module.exports = function (res, code, message) {
  return res.status(code).send({ message });
};
