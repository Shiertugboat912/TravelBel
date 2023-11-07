var offers = require("../controllers/offers");
var express = require("express");
var router = express.Router();

router.post("/", offers.getOffers);

module.exports = router;
