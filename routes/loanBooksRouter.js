const express = require("express");
const cors = require("cors");
const router = express.Router();
const fs = require("fs");

router.use(cors());

router.get("/:id", (req, res) => {
  res.send("hej");
});

router.post("/:id", (req, res) => {
  const bookId = req.params.id;
  fs.readFile("../books.json", (err, books) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Error" });
    }
    try {
      const loaned = req.body.loaned;
      let books = JSON.parse(books);
      books = books.map((book) => {
        if (book.id === bookId) {
          return { ...book, loaned: loaned };
        } else {
          return book;
        }
      });
      fs.writeFile("../books.json", JSON.stringify(books), (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ writeErr: "write Error" });
        }
      });
    } catch (parseErr) {
      return res.status(500).json({ error: "Parse Error" });
    }
  });
  console.log(bookId);
  console.log("Recieved post requst to loan" + bookId);
  console.log(req.body);
  res.send("hej" + bookId);
});

module.exports = router;
