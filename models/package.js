const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  userid: "string",
  packageType: "string",
  package: "string",
  name: "string",
  bookedon: "string",
});
const packages = mongoose.model("packages", schema);
module.exports = packages;
