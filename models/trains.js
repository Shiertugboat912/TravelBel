const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  TrainNo: "Number",
  "Train Name": "string",
  Src: "string",
  "S Station": "string",
  Destn: "string",
  "D Station": "string",
  Days: "string",
  Time: "string",
  Duration: "string",
  Sleeper: "Number",
  "3AC": "Number",
  "2AC": "Number",
  "1AC": "Number",
  "2S": "Number",
  "1S": "Number",
  Price: "Object",
});
const trains = mongoose.model("trains", schema, "Trains");
module.exports = trains;
