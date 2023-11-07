const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  Airline: "string",
  "AirLine Code": "string",
  "Flight No": "Number",
  Src: "string",
  Destn : "string",
  Seats: "Number",
  Price: "Number",
  Departure: "string",
  Duration: "string"
});
const flights = mongoose.model("flights", schema, "Flights");
module.exports = flights;
