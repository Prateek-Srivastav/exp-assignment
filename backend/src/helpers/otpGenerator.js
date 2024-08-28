const { User } = require("../models/user");

exports.generate = () => {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

exports.verify = async (email, otp) => {
  const user = await User.findOne({ email });

  if (user.otp === otp) return true;
  else return false;
};
