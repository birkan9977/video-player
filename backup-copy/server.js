require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const helmet = require("helmet");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//server security
app.use(helmet.noSniff());
app.use(helmet.xssFilter());

//hide server info
app.use(helmet.hidePoweredBy({ setTo: "PHP 7.4.3" }));

app.use("/", express.static(process.cwd() + "/"));
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/frame-player.html");
});

const portNum = process.env.PORT || 3000;

const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
});

// 404 Not Found Middleware
app.use(function (req, res, next) {
  res.status(404).type("text").send("Not Found");
});
