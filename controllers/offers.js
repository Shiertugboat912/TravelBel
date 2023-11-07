var Offers = require("../models/offers");

exports.getOffers = (req, res) => {
  Offers.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log(err));
};
