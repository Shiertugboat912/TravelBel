var express = require("express");
var router = express.Router();
var savePackCont = require("../controllers/Package");

router.post("/save", savePackCont.savePackage);
router.post("/fetch", savePackCont.getPackage);

module.exports = router;
