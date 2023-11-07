const user_feedback = require("../models/feedback");

exports.enterFeedback = (req, res) => {
  const temp = new user_feedback({
    name: req.body.name,
    surname: req.body.surname,
    date: req.body.date,
    feedback: req.body.question,
  });

  temp
    .save(temp)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

exports.getAllFeedback = (req, res) => {
  user_feedback
    .find()
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send({
        message: "Some error occurred.",
      });
    });
};
