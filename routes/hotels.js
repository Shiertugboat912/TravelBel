var express = require("express");
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const http = require("https");
var xhr = new XMLHttpRequest();
var axios = require("axios").default;

router.post("/", (req, res) => {
  var lat = req.body.lat;
  var lon = req.body.lon;
  console.log(lat, lon);
  var options = {
    method: "GET",
    url:
      "https://eu1.locationiq.com/v1/nearby.php?key="+process.env.locatioiqKey+"&lat=" +
      lat +
      "&lon=" +
      lon +
      "&format=json",

    params: {
      tag: "hotel",
      radius: "30000",
    },
  };

  axios
    .request(options)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => console.log("hotel error", err));
});

module.exports = router;
