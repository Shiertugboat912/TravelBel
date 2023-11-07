var express = require("express");
var app = express();
var bodyParser = require("body-parser");

//importing routes
var flights = require("./routes/flights");
var hotels = require("./routes/hotels");
var location = require("./routes/location");
var allinone = require("./routes/allinone");
var getpackages = require("./routes/getPackages");
var auth = require("./routes/auth");
var sendMail = require("./routes/sendmail");
var savePackage = require("./routes/savePackages");
var offers = require("./routes/offers");

//serving static files middelware
app.use(express.static("static"));
app.use(express.static("dist/TravelBel"));

// for ssl
//currently not ther so can access the site through http also

//cor policy middleware
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
//pass json as parameters through body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//importing db config
var db = require("./controllers/dbconfig");

//connectinfg to the database
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//starting server on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log("on");
});

//writing routes eg: "localhost:3000/flights"
app.use("/flights", flights);
app.use("/hotels", hotels);
app.use("/location", location);
app.use("/allinone", allinone);
app.use("/getpackages", getpackages);
app.use("/auth", auth);
app.use("/sendmail", sendMail);
app.use("/packages", savePackage);
app.use("/offers", offers);
