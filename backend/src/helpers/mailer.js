const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SIB_API_KEY;

const transEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
  email: "info.prateek@gmail.com",
  name: "Exp",
};

//for otps
exports.sendOtpMail = (email, name, otp, text) => {
  transEmailApi
    .sendTransacEmail({
      sender: sender,
      to: [{ email: email }],
      subject: "One Time Password(OTP) for expa.",
      htmlContent: `<!DOCTYPE html>
      <html lang="en">
        <body>
          <div
            style="
              font-family: Helvetica, Arial, sans-serif;
              min-width: 1000px;
              overflow: auto;
              line-height: 2;
            "
          >
            <div style="margin: 50px auto; width: 70%; padding: 20px 0">
              <div style="border-bottom: 1px solid #eee">
                <a
                  href=""
                  style="
                    font-size: 1.4em;
                    color: #208383;
                    text-decoration: none;
                    font-weight: 600;
                  "
                  >expa</a
                >
              </div>
              <p style="font-size: 1.1em">Hi ${name.split(" ")[0]},</p>
              <p>
                Thank you for choosing us. Use the following OTP to complete your
                Sign Up procedures. OTP is valid for 5 minutes.
              </p>
              <h2
                style="
                  background: #005d6c;
                  margin: 0 auto;
                  width: max-content;
                  padding: 0 10px;
                  color: #fff;
                  border-radius: 4px;
                "
              >
                ${otp}
              </h2>
              <p style="font-size: 0.9em">Regards,<br />expa Team</p>
              <hr style="border: none; border-top: 1px solid #eee" />
              <div
                style="
                  float: right;
                  padding: 8px 0;
                  color: #aaa;
                  font-size: 0.8em;
                  line-height: 1;
                  font-weight: 300;
                "
              >
                <p>expa,</p>
                <p>Delhi</p>
              </div>
            </div>
          </div>
        </body>
      </html>`,
    })
    .then(console.log)
    .catch(console.log);
};

//for any other information
exports.generalMail = (email, name, sub, text) => {
  transEmailApi
    .sendTransacEmail({
      sender: sender,
      to: [{ email: email }],
      subject: sub,
      textContent: "Hello " + name + ",\n\n" + text + "\n\nThank You!\n",
    })
    .then(console.log)
    .catch((e) => e);
};

// module.exports = send_mail;
