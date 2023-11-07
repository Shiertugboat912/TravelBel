var Flights = require("../models/flights");
var Bus = require("../models/bus");
var Trains = require("../models/trains");
var Hotels = require("../models//hotels");

//find the difference between today and the sent date
function findDifference(checkin) {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  checkin = convert(checkin);

  var date1 = new Date(today);
  var date2 = new Date(checkin);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
//convert date to mm/dd/yyy
function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [mnth, day, date.getFullYear()].join("/");
}
//find the percent to differ the price to set dynamic price
function getPercent(date) {
  if (date <= 2) return 2.5;
  if (date <= 4) return 0;
  if (date < 10) return -5;
  if (date < 30) return -25;
  else return -40;
}

function addTime(a, b) {
  var time1 = a.split("hr")[0];
  var time2 = b.split("hr")[0];
  return parseInt(time1) + parseInt(time2);
}

//returns the hotels for the selected destination
exports.hotels = (req, res) => {
  const { dest } = req.body;
  Hotels.find({ Locn: dest })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log(err));
};
//returns the buses for the selected route
exports.bus = (req, res) => {
  const { src, dest, checkin, persons } = req.body;
  buffer = findDifference(checkin);
  percent = getPercent(buffer);
  Bus.find({ Src: src, Destn: dest })
    .then((data) => {
      data.map(
        (bus) =>
          (bus.Price = Math.floor(
            bus.Price * persons + (bus.Price * percent) / 100
          ))
      );
      data.sort((a, b) => (a.Price > b.Price ? 1 : b.Price > a.Price ? -1 : 0));
      res.send(data);
    })
    .catch((err) => console.log(err));
};
//returns the trains for the selected route
exports.train = (req, res) => {
  const { src, dest, checkin, persons } = req.body;
  buffer = findDifference(checkin);
  percent = getPercent(buffer);
  Trains.find({ Src: src, Destn: dest })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log(err));
};
//returns the flights for the selected route
exports.flight = (req, res) => {
  const { src, dest, checkin, persons } = req.body;
  buffer = findDifference(checkin);
  percent = getPercent(buffer);
  Flights.find({ Src: src, Destn: dest })
    .then((data) => {
      data.map(
        (flight) =>
          (flight.Price = Math.floor(
            flight.Price * persons + (flight.Price * percent) / 100
          ))
      );
      data.sort((a, b) => (a.Price > b.Price ? 1 : b.Price > a.Price ? -1 : 0));
      res.send(data);
    })
    .catch((err) => console.log(err));
};
//returns the oneway packages
exports.package = (req, res) => {
  const { src, dest, checkin, checkout, persons } = req.body;
  buffer = findDifference(checkin);
  buffer2 = findDifference(checkout);
  stay = buffer2 - buffer;
  percent = getPercent(buffer);
  Flights.find({ Src: src, Destn: dest })
    .then((fdata) => {
      Bus.find({ Src: src, Destn: dest }).then((bdata) => {
        Trains.find({ Src: src, Destn: dest }).then((tdata) => {
          Hotels.find({ Locn: dest }).then((hdata) => {
            //pre-processing
            fdata.map(
              (flight) =>
                (flight.Price = Math.floor(
                  flight.Price * persons + (flight.Price * percent) / 100
                ))
            );
            bdata.map(
              (Bus) =>
                (Bus.Price = Math.floor(
                  Bus.Price * persons + (Bus.Price * percent) / 100
                ))
            );

            hdata.sort((a, b) =>
              a.Price["Premium Suite"] > b.Price["Premium Suite"]
                ? 1
                : b.Price["Premium Suite"] > a.Price["Premium Suite"]
                ? -1
                : 0
            );

            fdata.sort((a, b) =>
              a.Price > b.Price ? 1 : b.Price > a.Price ? -1 : 0
            );

            bdata.sort((a, b) =>
              a.Price > b.Price ? 1 : b.Price > a.Price ? -1 : 0
            );

            //end

            //create packagaes
            Packages = [];
            var k = 0;

            if (fdata.length > 0) {
              for (var i = 0; i < fdata.length && i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                  Packages.push({
                    name: dest + " Package " + ++k,
                    type: "Flight",
                    flight: fdata[i],
                    duration: addTime(fdata[i].Duration, "0"),
                    distance: hdata[j]["Dist Air"],
                    hotel: hdata[j],
                    total: fdata[i].Price + hdata[j].Price["Non AC room"],
                    persons: persons,
                  });
                }
              }
            }

            k = 0;

            if (bdata.length > 0) {
              for (var i = 0; i < bdata.length && i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                  Packages.push({
                    name: dest + " Package " + ++k,
                    type: "Bus",
                    bus: bdata[i],
                    duration: addTime(bdata[i].Duration, "0"),
                    distance: hdata[j]["Dist Bus"],
                    hotel: hdata[j],
                    total: bdata[i].Price + hdata[j].Price["Non AC room"],
                    persons: persons,
                  });
                }
              }
            }

            k = 0;

            if (tdata.length > 0) {
              for (var i = 0; i < tdata.length && i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                  Packages.push({
                    name: dest + " Package " + ++k,
                    type: "Train",
                    duration: addTime(tdata[i].Duration, "0"),
                    distance: hdata[j]["Dist Train"],
                    train: tdata[i],
                    hotel: hdata[j],
                    total: hdata[j].Price["Non AC room"],
                    persons: persons,
                  });
                }
              }
            }

            res.send({
              NAME: src + " to " + dest,
              packages: Packages,
              persons: persons,
              checkin: checkin,
              days: stay,
            });
          });
        });
      });
    })
    .catch((err) => console.log(err));
};
//returns the round trip packages
exports.roundPackage = (req, res) => {
  const { src, dest, checkin, checkout, persons } = req.body;
  buffer = findDifference(checkin);
  percent = getPercent(buffer);
  buffer2 = findDifference(checkout);
  stay = buffer2 - buffer;
  percentreturn = getPercent(buffer2);
  Flights.find({ Src: src, Destn: dest })
    .then((fdata) => {
      Bus.find({ Src: src, Destn: dest }).then((bdata) => {
        Trains.find({ Src: src, Destn: dest }).then((tdata) => {
          Flights.find({ Src: dest, Destn: src }).then((Rfdata) => {
            Bus.find({ Src: dest, Destn: src }).then((Rbdata) => {
              Trains.find({ Src: dest, Destn: src }).then((Rtdata) => {
                Hotels.find({ Locn: dest }).then((hdata) => {
                  //pre-processing
                  fdata.map(
                    (flight) =>
                      (flight.Price = Math.floor(
                        flight.Price * persons + (flight.Price * percent) / 100
                      ))
                  );

                  Rfdata.map(
                    (flight) =>
                      (flight.Price = Math.floor(
                        flight.Price * persons +
                          (flight.Price * percentreturn) / 100
                      ))
                  );
                  bdata.map(
                    (Bus) =>
                      (Bus.Price = Math.floor(
                        Bus.Price * persons + (Bus.Price * percent) / 100
                      ))
                  );
                  Rbdata.map(
                    (Bus) =>
                      (Bus.Price = Math.floor(
                        Bus.Price * persons + (Bus.Price * percentreturn) / 100
                      ))
                  );

                  hdata.sort((a, b) =>
                    a.Price["Premium Suite"] > b.Price["Premium Suite"]
                      ? 1
                      : b.Price["Premium Suite"] > a.Price["Premium Suite"]
                      ? -1
                      : 0
                  );

                  fdata.sort((a, b) =>
                    a.Price > b.Price ? 1 : b.Price > a.Price ? -1 : 0
                  );
                  Rfdata.sort((a, b) =>
                    a.Price > b.Price ? 1 : b.Price > a.Price ? -1 : 0
                  );

                  bdata.sort((a, b) =>
                    a.Price > b.Price ? 1 : b.Price > a.Price ? -1 : 0
                  );
                  Rbdata.sort((a, b) =>
                    a.Price > b.Price ? 1 : b.Price > a.Price ? -1 : 0
                  );

                  //end

                  //create packagaes
                  Packages = [];
                  var k = 0;

                  if (fdata.length > 0 && Rfdata.length > 0) {
                    for (
                      var i = 0;
                      i < fdata.length && i < 3 && Rfdata.length;
                      i++
                    ) {
                      for (var j = 0; j < 3; j++) {
                        Packages.push({
                          name: dest + " Package " + ++k,
                          type: "Flight",
                          flight: fdata[i],
                          flightback: Rfdata[i],
                          hotel: hdata[j],
                          duration: addTime(
                            fdata[i].Duration,
                            Rfdata[i].Duration
                          ),
                          distance: hdata[j]["Dist Air"],
                          total:
                            fdata[i].Price +
                            hdata[j].Price["Non AC room"] +
                            Rfdata[i].Price,
                          persons: persons,
                        });
                      }
                    }
                  }

                  k = 0;

                  if (bdata.length > 0 && Rbdata.length > 0) {
                    for (
                      var i = 0;
                      i < bdata.length && i < 3 && i < Rbdata.length;
                      i++
                    ) {
                      for (var j = 0; j < 3; j++) {
                        Packages.push({
                          name: dest + " Package " + ++k,
                          type: "Bus",
                          bus: bdata[i],
                          busback: Rbdata[i],
                          hotel: hdata[j],
                          duration: addTime(
                            bdata[i].Duration,
                            Rbdata[i].Duration
                          ),
                          distance: hdata[j]["Dist Bus"],
                          total:
                            bdata[i].Price +
                            hdata[j].Price["Non AC room"] +
                            Rbdata[i].Price,
                          persons: persons,
                        });
                      }
                    }
                  }

                  k = 0;

                  if (tdata.length > 0 && Rtdata.length > 0) {
                    for (
                      var i = 0;
                      i < tdata.length && i < 3 && i < Rtdata.length;
                      i++
                    ) {
                      for (var j = 0; j < 3; j++) {
                        Packages.push({
                          name: dest + " Package " + ++k,
                          type: "Train",
                          train: tdata[i],
                          trainback: Rtdata[i],
                          hotel: hdata[j],
                          duration: addTime(
                            tdata[i].Duration,
                            Rtdata[i].Duration
                          ),
                          distance: hdata[j]["Dist Train"],
                          total: hdata[j].Price["Non AC room"],
                          persons: persons,
                        });
                      }
                    }
                  }

                  res.send({
                    NAME: src + " to " + dest,
                    packages: Packages,
                    persons: persons,
                    checkin: checkin,
                    checkout: checkout,
                    days: stay,
                  });
                });
              });
            });
          });
        });
      });
    })
    .catch((err) => console.log(err));
};
