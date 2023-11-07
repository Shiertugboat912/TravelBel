const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    Bus : "string",
    "Bus No" : "string",
    Src : "string",
    "Src Stop" : "string",
    Destn : "string",
    "Destn Stop" : "string",
    Time : "string",
    Duration : "string",
    "Non AC" : "Number",
    "Non AC Sleeper" : "Number",
    AC : "Number",
    "AC Sleeper" : "Number",
    "AC semi Sleeper" : "Number",
    Price : "Number"
});
const bus = mongoose.model("bus", schema, "Bus");
module.exports = bus;
