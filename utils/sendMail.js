const nodemailer = require("nodemailer");
const otpgenerator = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const transport = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASS,
  },
});

const sendMail = async (email, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "RESET YOUR PASSWORD FOR YELPCAMP",
    html: `<h1>Your OTP Is ${otp}. It Will Expire After 5 Minutes.</h1>
        <h3>*If You Did Not Request For Password Change, Please Ignore This Message.</h3>`,
  };

  const mail = await transport.sendMail(mailOptions);
  return mail;
};

module.exports.sendMail = sendMail;
module.exports.otpgenerator = otpgenerator;
