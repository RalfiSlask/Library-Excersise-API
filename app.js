var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const addBooksRouter = require("./routes/addBooksRouter.js");
const loanBooksRouter = require("./routes/loanBooksRouter.js");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/library", addBooksRouter);
app.use("/loan", loanBooksRouter);

module.exports = app;
