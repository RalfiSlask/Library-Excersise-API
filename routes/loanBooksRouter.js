const express = require("express");
const cors = require("cors");
const router = express.Router();
const fs = require("fs");

router.use(cors());

router.get("/:id", (req, res) => {
  res.send("loan id is working");
});

router.get("/", (req, res) => {
  res.send("loan url is working");
});

router.patch("/:id", (req, res) => {
  const bookId = req.params.id;
  fs.readFile("./books.json", (err, booksData) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Error" });
    }
    try {
      const loaned = req.body.loaned;
      let books = JSON.parse(booksData);
      books = books.map((book) => {
        console.log(book.id);
        if (book.id === bookId) {
          return { ...book, loaned: loaned };
        } else {
          return book;
        }
      });
      console.log(books);
      fs.writeFile("./books.json", JSON.stringify(books), (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ writeErr: "write Error" });
        }
        res.status(200).json(books);
      });
    } catch (parseErr) {
      return res.status(500).json({ error: "Parse Error" });
    }
  });
});

module.exports = router;
