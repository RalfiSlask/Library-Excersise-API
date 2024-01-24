const express = require("express");
const cors = require("cors");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

router.use(cors());

router.get("/health", function (req, res) {
  res.send("libraryRouter is working!");
});

router.get("/", function (req, res) {
  fs.readFile("./books.json", function (err, books) {
    if (err) {
      res.status(500).json({ error: "Error reading file" });
    } else {
      try {
        res.json(JSON.parse(books));
      } catch (parseErr) {
        res.status(500).json({ error: "Error parsing JSON" });
      }
    }
  });
});

router.post("/", function (req, res) {
  fs.readFile("./books.json", function (err, books) {
    if (err) {
      res.status(500).json({ error: "Error reading file" });
    } else {
      try {
        console.log(req.body);
        const booksData = JSON.parse(books);
        const newBook = {
          id: uuidv4(),
          ...req.body,
          loaned: false,
        };
        booksData.push(newBook);
        fs.writeFile(
          "./books.json",
          JSON.stringify(booksData),
          function (writeErr) {
            if (writeErr) {
              return res.status(500).json("Error writing file");
            }
            res.send(booksData);
          }
        );
      } catch (parseErr) {
        res.status(500).json({ error: "parseError " });
      }
    }
  });
});

module.exports = router;
