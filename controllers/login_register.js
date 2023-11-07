const user_details = require("../models/login");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = function (req, res) {
  const { name, surname, email, mob, password, confirm } = req.body;
  console.log(name, surname, email, mob, password, confirm);
  if (!email || !password) {
    console.log("email or pass");
    return res.status(422).json({ error: "Please provide email or password" });
  }

  if (password != confirm) {
    console.log("confirm");
    return res.status(422).json({ error: "Password does not match" });
  }
  user_details.findOne({ email }, function (err, existingUser) {
    if (err) {
      console.log("here");
      return res.status(422).json({ error: "Oops! Something went Wrong" });
    }
    if (existingUser) {
      return res.status(422).json({ error: "User already exists" });
    } else {
      const user = new user_details({
        name,
        surname,
        email,
        password,
        mob,
      });

      user.save(function (err) {
        if (err) {
          console.log("saving error");
          return res.status(422).json({
            error: "Oops! Something went wrong",
          });
        }
        return res.status(200).json({ registered: true });
      });
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  user_details
    .findOne({ email: email })
    .then((data) => {
      if (!data) return res.status(422).json({ error: "Invalid user" });
      else if (data.hasSamePassword(password)) {
        json_token = jwt.sign(
          {
            userId: data.email,
            username: data.name,
          },
          process.env.secret,
          { expiresIn: "1h" }
        );

        return res.json(json_token);
      }
    })
    .catch((err) => {
      console.log(err);
      res.send("nonsense");
    });
};

exports.authMiddleware = function (req, res, next) {
  const json_token = req.headers.Authorization;
  console.log(json_token);
  try {
    if (json_token) {
      const user = parseToken(json_token);
      user_details.findById(user.userId, function (err, user) {
        if (err) {
          return res.status(422).json({
            error: "Oops! Something went wrong",
          });
        }
        if (user) {
          res.locals.user = user;
          next();
        } else {
          return res.status(422).json({ error: "Not authorized user" });
        }
      });
    } else {
      return res.status(422).json({ error: "Not authorized user" });
    }
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err,
    });
  }
};

function parseToken(token) {
  return jwt.verify(token.split(" ")[1], process.env.secret);
}
