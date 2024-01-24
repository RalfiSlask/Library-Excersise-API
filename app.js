var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

// filsökvägar till våra routrar som

const addBooksRouter = require("./routes/addBooksRouter.js");
const loanBooksRouter = require("./routes/loanBooksRouter.js");
const deleteBooksRouter = require("./routes/deleteBooksRouter.js");
const loginRouter = require("./routes/loginRouter.js");

var app = express();

// Alla dessa under kallas middleware

// cors() tillåter requests från domäner / klienten
app.use(cors());
// logger() för att kunna logga / debugging
app.use(logger("dev"));
// express.json() konverterar (parsar) inkommande request till json / därför vi ej behöver parsa req.body t.ex.
app.use(express.json());
// osäker på denna urlencoded()
app.use(express.urlencoded({ extended: false })); //
// cookieParser() konverterar kakor, mums!
app.use(cookieParser());
// express.static() serverar oss statiska filer, CSS / JS osv. public är mappen vi har dessa i.
app.use(express.static(path.join(__dirname, "public")));

// vilka urls vi vill använda oss av på routrarna

app.use("/library", addBooksRouter);
app.use("/loan", loanBooksRouter);
app.use("/delete", deleteBooksRouter);
app.use("/login", loginRouter);

module.exports = app;
