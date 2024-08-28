const express = require("express");
const bcrypt = require("bcryptjs");
const { User } = require("../models/user");
const errorRespond = require("../helpers/errorRespond");
const { sendOtpMail } = require("../helpers/mailer");
const otpGenerator = require("../helpers/otpGenerator");
const { getGoogleAuthURL, getTokens } = require("../helpers/googleAuth");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;
  if (
    !String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  )
    return errorRespond(res, 400, "Please enter a valid email.");

  if (!fullname) return errorRespond(res, 400, "Full name is required");
  else if (!email) return errorRespond(res, 400, "Email is required");
  else if (!password) return errorRespond(res, 400, "Password is required");

  let user = await User.findOne({ email });

  let otp = otpGenerator.generate();

  const hashedPw = await bcrypt.hash(password, 12);

  if (!user) {
    sendOtpMail(email, fullname, otp);

    user = new User({
      fullname,
      email,
      password: hashedPw,
      otp,
    });

    await user.save();
  } else if (user && !user.emailVerified) {
    sendOtpMail(email, fullname, otp);
    await user.updateOne({ otp });
  } else if (user && user.emailVerified)
    return errorRespond(res, 400, "User already registered");

  res.send({ message: "OTP sent successfully" });
});

router.post("/verifyOtp", async (req, res) => {
  const { email, otp } = req.body;

  if (
    !String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  )
    return errorRespond(res, 400, "Please enter a valid email.");

  const user = await User.findOne({ email });

  if (!user) return errorRespond(res, 400, "User is not registered");

  if (!user.otp) return errorRespond(res, 500, "Something went wrong.");

  if (user.otp === otp) {
    await user.updateOne({ emailVerified: true, $unset: { otp: "" } });

    let sendUser = { ...user._doc };

    delete sendUser.password;
    delete sendUser.otp;
    delete sendUser.__V;

    const token = await user.generateAuthToken(user._id?.toString());

    return res.send({ user: sendUser, token });
  } else if (user.otp !== otp) return errorRespond(res, 400, "Wrong OTP");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let isValidUser;

  if (
    !String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  )
    return errorRespond(res, 400, "Please enter a valid email.");

  const user = await User.findOne({ email }, { __v: 0 });

  if (!user)
    return errorRespond(res, 400, "User is not registered. Please register.");
  else if (user) isValidUser = await bcrypt.compare(password, user.password);

  let sendUser = { ...user._doc };

  delete sendUser.password;

  if (isValidUser) {
    const token = user.generateAuthToken(user._id?.toString());
    res.header("x-auth-token", token).send({ user: sendUser, token });
  } else if (!isValidUser) return errorRespond(res, 400, "Incorrect password");
});

router.get("/google/url", (req, res) => {
  const url = getGoogleAuthURL();

  return res.send({ url });
});

router.get(`/google`, async (req, res) => {
  const code = req.query.code;

  const { id_token, access_token } = await getTokens({
    code,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.SERVER_ROOT_URI}/api/auth/google`,
  });

  // Fetch the user's profile with the access token and bearer
  const googleUser = await axios
    .get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });

  const { email, name } = googleUser;

  const user = await User.findOne({ email });

  if (user) {
    let sendUser = { ...user._doc };

    delete sendUser.password;

    const token = user.generateAuthToken(user._id?.toString());

    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: 900000,
      httpOnly: false,
      secure: true,
      domain: process.env.UI_ROOT_URI,
      path: "/",
      sameSite: "lax",
    });
    return res.redirect(process.env.UI_ROOT_URI);
  } else {
    // const token = jwt.sign(googleUser, process.env.JWT_PRIVATE_KEY);

    // console.log(googleUser);

    let user = new User({
      fullname: googleUser.name,
      email: googleUser.email,
      emailVerified: true,
      isGoogleAuth: true,
    });

    await user.save();

    const token = await user.generateAuthToken(user._id?.toString());

    res.cookie(process.env.COOKIE_NAME, token, {
      maxAge: 900000,
      httpOnly: false,
      secure: true,
      domain: process.env.UI_ROOT_URI,
      path: "/",
      sameSite: "lax",
    });

    return res.redirect(process.env.UI_ROOT_URI);
  }
});

router.get("/user", async (req, res) => {
  try {
    // console.log(req.cookies);

    const user = jwt.verify(req.query.token, process.env.JWT_PRIVATE_KEY);

    const userDetail = await User.findById(user._id);

    return res.send({
      user: { ...user, phone: userDetail.phone },
      token: req.query.token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Please login" });
  }
});

router.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  )
    return res.send({ message: "Authorised successfully.", code: "AUTH_TRUE" });

  res.status(400).send({ message: "Cannot authorise.", code: "AUTH_FALSE" });
});

router.put("/update", auth, async (req, res) => {
  const updatedUserDetail = req.body;

  console.log(req.body);

  const user = await User.findOneAndUpdate(
    req.user._id,
    { fullname: req.body.fullname, phone: req.body.phone },
    { upsert: true }
  );

  console.log(user);
  return res.send({ message: "user_updated_successfully" });
});

router.get("/details", async (req, res) => {
  const userDetail = await User.findById(req.query.id);

  return res.send({
    name: userDetail.fullname,
  });
});

module.exports = router;
