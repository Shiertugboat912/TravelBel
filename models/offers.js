const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: "string",
  description: "string",
  img: "string",
});
const offers = mongoose.model("offers", schema, "Offers");
module.exports = offers;
