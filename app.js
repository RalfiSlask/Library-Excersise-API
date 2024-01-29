var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017").then(client => {
    console.log('Vi är uppkollade');

    const db = client.db("library");
    app.locals.db = db;
})

const addBooksRouter = require("./routes/addBooksRouter.js");
const loanBooksRouter = require("./routes/loanBooksRouter.js");
const deleteBooksRouter = require("./routes/deleteBooksRouter.js");
const loginRouter = require("./routes/loginRouter.js");
const imageRouter = require("./routes/imageRouter.js");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/library", addBooksRouter);
app.use("/loan", loanBooksRouter);
app.use("/delete", deleteBooksRouter);
app.use("/login", loginRouter);
app.use("/image", imageRouter);

module.exports = app;
