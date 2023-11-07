var Package = require("../models/package");

exports.savePackage = (req, res) => {
  console.log(req.body);
  const temp = new Package({
    userid: req.body.id,
    name: req.body.name,
    packageType: req.body.type,
    package: req.body.package,
    bookedon: req.body.date,
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

exports.getPackage = (req, res) => {
  var email = req.body.id;
  Package.find({ userid: email })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log(err));
};
