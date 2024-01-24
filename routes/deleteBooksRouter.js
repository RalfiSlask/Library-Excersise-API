const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/:bookId", (req, res) => {
  res.send(req.params);
});

router.delete("/:bookId", (req, res) => {
  console.log(req.body);
  fs.readFile("./books.json", (err, books) => {
    if (err) {
      console.log("cant read books");
      res.status(500).json({ Error: "Cant read books" });
    } else {
      const existingBooks = JSON.parse(books);
      existingBooks.splice(Number(req.id) - 1, 1);
      fs.writeFile(
        "./books.json",
        JSON.stringify(existingBooks, null, 2),
        (writeErr) => {
          if (writeErr) {
            res.status(500).json({ Error: "Error writing books" });
          }
          res.json({ newBooks: existingBooks });
        }
      );
    }
  });
});

module.exports = router;
