var express = require("express");
var router = express.Router();
require("dotenv").config();
const nodemailer = require("nodemailer");

router.post("/", (req, res) => {
  let user = req.body;
  sendMail(user, (info) => {
    res.send(info);
  }).catch((err) => console.log(err));
});

async function sendMail(user, callback) {
  const mailbody = `<p>
  Thank you ${user.name} for booking with TravelBel. The details of your travel
  will be sent to you shortly
</p>
`;
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.mailuser, // generated ethereal user
      pass: process.env.mailpass, // generated ethereal password
    },
  });

  let mailOptions = {
    from: '"TravelBel" <elroygomes30@gmail.com>', // sender address
    to: user.email, // list of receivers
    subject: "Confirming the booking", // Subject line
    text: "Hello world", // plain text body
    html: mailbody, // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}

module.exports = router;
