var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
let urls = [
  process.env.URL,
  "mongodb://127.0.0.1:27017/test",
];

const db = {};
db.mongoose = mongoose;
db.url = urls[0];

module.exports = db;
