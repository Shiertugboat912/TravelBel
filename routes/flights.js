var express = require("express");
var router = express.Router();

var axios = require("axios").default;

var Amadeus = require("amadeus");
var amadeus = new Amadeus({
  clientId: process.env.amadeusClientId,
  clientSecret: process.env.amamadeusClientSec,
});

router.post("/src/latlong", (req, res) => {
  // Paste your LocationIQ token below.
  var src = req.body.src;
  var options = {
    method: "GET",
    url:
      "https://eu1.locationiq.com/v1/search.php?key="+process.env.locatioiqKey+"&q=" +
      src +
      "&format=json",
  };

  axios
    .request(options)
    .then((response) => {
      res.send(response.data[0]);
    })
    .catch((err) => console.log(err));
});

router.post("/airport", (req, res) => {
  lat = req.body.lat;
  lon = req.body.lon;
  var options = {
    method: "GET",
    url:
      "https://ourairport-data-search.p.rapidapi.com/nearest/" +
      lat +
      "," +
      lon,

    params: { iataOnly: "true", maxResults: "1" },
    headers: {
      "x-rapidapi-key": rapidKey,
      "x-rapidapi-host": "ourairport-data-search.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      res.send(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
});

router.post("/getprices", (req, res) => {
  var src = req.body.src;
  var dest = req.body.dest;
  var date = req.body.date;

  amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: src,
      destinationLocationCode: dest,
      departureDate: date,
      adults: "1",
      max: "100",
      nonStop: "true",
      currencyCode: "INR",
    })
    .then(function (data) {
      flights = data.data.map((address) => {
        return {
          name: address.itineraries[0].segments[0].operating.carrierCode,
          departure: address.itineraries[0].segments[0].departure.at,
          arrival: address.itineraries[0].segments[0].arrival.at,
          price: address.price.grandTotal,
          type: address.travelerPricings[0].fareDetailsBySegment[0].cabin,
        };
      });
      console.log(
        flights.sort((a, b) => {
          return a.price.localeCompare(b.price);
        })
      );
      res.send(
        flights.sort((a, b) => {
          return a.price.localeCompare(b.price);
        })
      );
    })
    .catch(function (err) {
      res.send(err);
    });
});

router.post("/test", (req, res) => {
  var options = {
    method: "GET",
    url: "https://priceline-com.p.rapidapi.com/flights/LAX/SFO/2021-02-17",
    params: { adults: "1" },
    headers: {
      "x-rapidapi-key": rapidKey,
      "x-rapidapi-host": "priceline-com.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
});

module.exports = router;
