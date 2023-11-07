const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const schema = new mongoose.Schema({
  name: "string",
  surname: "string",
  email: "string",
  password: "string",
  mob: "string",
  photo: "string",
});

schema.pre("save", function (next) {
  const user = this;
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return res.status(422).json({
        error: "There is an error while gensalt hash",
      });
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return res.status(422).json({
          error: "There is an error while password hash",
        });
      }
      user.password = hash;
      next();
    });
  });
});

schema.methods.hasSamePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
const user_details = mongoose.model("User_Details", schema, "Users");
module.exports = user_details;
