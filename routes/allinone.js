var express = require("express");
var router = express.Router();

var axios = require("axios").default;

var Amadeus = require("amadeus");
var amadeus = new Amadeus({
  clientId: process.env.amadeusClientId,
  clientSecret: process.env.amamadeusClientSec,
});

router.post("/", (req, res) => {
  var source = req.body.src;
  var destination = req.body.dest;
  var persons = req.body.persons;
  var date = convert(req.body.date);

  console.log("begin");

  var srclatlon;
  var destlatlon;

  var srciata;
  var destiata;

  latlonapi(source)
    .then((data) => {
      srclatlon = { lat: data.lat, lon: data.lon };
      iataAPI(srclatlon)
        .then((data) => {
          srciata = data.iata;
          latlonapi(destination)
            .then((data) => {
              destlatlon = { lat: data.lat, lon: data.lon };
              iataAPI(destlatlon)
                .then((data) => {
                  destiata = data.iata;
                  getprices(srciata, destiata, persons, date)
                    .then((data) => {
                      console.log(destiata, "complete");
                      res.send(data);
                    })
                    .catch((err) => console.log("price err"));
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));

  /* latlonapi(source)
    .then((data) => {
      srclatlon = { lat: data.lat, lon: data.lon };
      latlonapi(destination)
        .then((data) => {
          destlatlon = { lat: data.lat, lon: data.lon };
          iataAPI(srclatlon)
            .then((data) => {
              srciata = data.iata;
              iataAPI(destlatlon)
                .then((data) => {
                  destiata = data.iata;
                  console.log(srciata, destiata);

                  getprices(srciata, destiata, persons, date)
                    .then((data) => {
                      console.log(destiata, "complete");
                      res.send(data);
                    })
                    .catch((err) => console.log("price err"));
                })
                .catch((err) => console.log("dest iata"));
            })
            .catch((err) => console.log("src iata"));
        })
        .catch((err) => console.log("dest latlon"));
    })
    .catch((err) => console.log("src latlon")); */
});

function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
}

function latlonapi(location) {
  var options = {
    method: "GET",
    url:
      "https://eu1.locationiq.com/v1/search.php?key="+process.env.locatioiqKey+"&q=" +
      location +
      "&format=json",
  };
  return axios
    .request(options)
    .then(function (response) {
      return response.data[0];
    })
    .catch(function (error) {
      console.error(error.response.statusText);
    });
}

function iataAPI(latlon) {
  var options = {
    method: "GET",
    url:
      "https://ourairport-data-search.p.rapidapi.com/nearest/" +
      latlon.lat +
      "," +
      latlon.lon,

    params: { iataOnly: "true", maxResults: "1" },
    headers: {
      "x-rapidapi-key": process.env.rapidKey,
      "x-rapidapi-host": "ourairport-data-search.p.rapidapi.com",
    },
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data.results[0];
    })
    .catch(function (error) {
      console.error("iataapierror");
    });
}

function getprices(src, dest, persons, date) {
  return amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: src,
      destinationLocationCode: dest,
      departureDate: date,
      adults: persons,
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
      return flights.sort((a, b) => {
        return a.price.localeCompare(b.price);
      });
    })
    .catch(function (err) {
      console.log("price error");
    });
}

module.exports = router;
