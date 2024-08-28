// const express = require("express");
// const jwt = require("jsonwebtoken");
const axios = require("axios");
const querystring = require("querystring");
// const cookieParser = require("cookie-parser");

// const port = 8080;

// const app = express();

// app.use(cookieParser());

const redirectURI = "auth/google";

exports.getGoogleAuthURL = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${process.env.SERVER_ROOT_URI}/api/${redirectURI}`,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  return `${rootUrl}?${querystring.stringify(options)}`;
};

// Getting login URL
// app.get("/auth/google/url", (req, res) => {
//   return res.send(getGoogleAuthURL());
// });

exports.getTokens = ({ code, clientId, clientSecret, redirectUri }) => {
  /*
   * Uses the code to get tokens
   * that can be used to fetch the user's profile
   */
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };

  return axios
    .post(url, querystring.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error);
    });
};

// Getting the user from Google with the code
// app.get(`/google`, async (req, res) => {
//   // const code = req.query.code as string;

//   const { id_token, access_token } = await getTokens({
//     code,
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     redirectUri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
//   });

//   // Fetch the user's profile with the access token and bearer
//   const googleUser = await axios
//     .get(
//       `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
//       {
//         headers: {
//           Authorization: `Bearer ${id_token}`,
//         },
//       }
//     )
//     .then((res) => res.data)
//     .catch((error) => {
//       console.error(`Failed to fetch user`);
//       throw new Error(error.message);
//     });

//   const token = jwt.sign(googleUser, JWT_SECRET);

//   res.cookie(COOKIE_NAME, token, {
//     maxAge: 900000,
//     httpOnly: true,
//     secure: false,
//   });

//   res.redirect(process.env.UI_ROOT_URI);
// });

// Getting the current user
// app.get("/auth/me", (req, res) => {
//   console.log("get me");
//   try {
//     const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
//     console.log("decoded", decoded);
//     return res.send(decoded);
//   } catch (err) {
//     console.log(err);
//     res.send(null);
//   }
// });

// function main() {
//   app.listen(port, () => {
//     console.log(`App listening http://localhost:${port}`);
//   });
// }

// main();
