const express = require("express");
const cors = require("cors");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

router.use(cors());

router.get("/health", function (req, res) {
  res.send("libraryRouter is working!");
});


router.get("/", function (req, res) {
  req.app.locals.db.collection('books').find().toArray().then(response => {
    console.log(response)
    res.send(response)
  })
});

router.post("/", function (req, res) {
  const { bookName, author } = req.body;

  // looking through database if the books already exists
  req.app.locals.db.collection('books').findOne( { "bookName": bookName, "author": author } ).then(existingBook => {
    if (existingBook) {
      res.status(409).json( { message: "Book already exist in the collection"})
    } else {

      // if it does not exist create new book and insert to database
      const newBook = { "id": uuidv4(), "bookName": bookName, "author": author, "loaned": false };
      req.app.locals.db.collection('books').insertOne(newBook).then(response => {
        console.log(response)
        res.json( { data: req.body } );
      })
    }
  }).catch(error => {
    console.log(error, 'error')
    res.status(500).json( { message: 'Error checking for existing book '})
  })
});

module.exports = router;
