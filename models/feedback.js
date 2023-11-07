const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: "string",
  surname: "string",
  date: "string",
  feedback: "string",
});
const user_feedback = mongoose.model("User_Feedback", schema, "feedbacks");
module.exports = user_feedback;
