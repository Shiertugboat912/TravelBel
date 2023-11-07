var express = require("express");
var router = express.Router();

var axios = require("axios").default;

router.post("/autocomplete", (req, res) => {
  var name = req.body.name;
  var options = {
    method: "GET",
    url:
      "https://eu1.locationiq.com/v1/autocomplete.php?key="+process.env.locatioiqKey+"&q=" +
      name +
      "&format=json",
    params: { countrycodes: "in", limit: "3", dedupe: "1" },
  };

  axios
    .request(options)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
