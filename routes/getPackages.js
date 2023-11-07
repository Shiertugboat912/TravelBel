var express = require("express");
var router = express.Router();
var PackageCont = require("../controllers/packages");

router.post("/", PackageCont.package);
router.post("/flights", PackageCont.flight);
router.post("/trains", PackageCont.train);
router.post("/bus", PackageCont.bus);
router.post("/hotels", PackageCont.hotels);
router.post("/round", PackageCont.roundPackage);

module.exports = router;
