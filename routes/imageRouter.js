const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.send("router is working");
});

router.post("/savefile/:id", upload.single("image"), (req, res) => {
  const imageUrl = `/upload/${req.file.filename}`;
  res.send({ imageUrl: imageUrl });
});

module.exports = router;
