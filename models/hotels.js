const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  Name: "string",
  Locn: "string",
  Add: "string",
  Phone: "string",
  "Dist Air": "Number",
  "Dist Train": "Number",
  "Dist Bus": "Number",
  "A/C room": "Number",
  "Non A/C room": "Number",
  "Delux room": "Number",
  "Premium Suite": "Number",
  Price: {
    "Non AC room": "Number",
    "AC room": "Number",
    "Delux room": "Number",
    "Premium Suite": "Number",
  },
});
const hotels = mongoose.model("hotels", schema, "Hotels");
module.exports = hotels;
