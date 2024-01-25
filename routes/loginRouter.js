const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const CryptoJS = require("crypto-js");

router.get("/", (req, res) => {
  res.send("this route login is working!");
});

const getEncryptedPassword = (password, key) => {
  return CryptoJS.AES.encrypt(password, key).toString();
};

router.get("/register", (req, res) => {
  res.send("register route is working");
});

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  const key = "Salt Nyckel";
  const encryptedPassword = getEncryptedPassword(password, key);
  fs.readFile("./logins.json", (err, data) => {
    if (err) {
      res.status(500).json({ err: "Error reading logins" });
    } else {
      const users = JSON.parse(data);
      const newUser = {
        id: uuidv4(),
        email: email,
        password: encryptedPassword,
      };
      console.log(encryptedPassword);
      users.push(newUser);
      console.log(users, newUser);
      fs.writeFile(
        "./logins.json",
        JSON.stringify(users, null, 2),
        (writeErr) => {
          if (writeErr) {
            res.status(500).json({ writeErr: "Cant read files" });
            console.log("writeerror");
          } else {
            res.json({ read: "can read file" });
          }
        }
      );
    }
  });
});

router.post("", (req, res) => {
  fs.readFile("./logins.json", (err, loginData) => {
    if (err) {
      res.status(500).json({ err: "could not find login data" });
    } else {
      const { email, password } = req.body;
      const key = "Salt Nyckel";
      const encryptedPassword = getEncryptedPassword(password, key);

      const loginArray = JSON.parse(loginData);
      const user = loginArray.find((user) => user.email === email);
      if (user) {
        const decryptedPassword = CryptoJS.AES.decrypt(
          encryptedPassword,
          key
        ).toString(CryptoJS.enc.Utf8);
        if (password === decryptedPassword) {
          res.send("Login succesfull");
        }
      } else {
        console.log(encryptedPassword);
        res.json({ exist: "does not exist" });
        console.log("user not found on server/database");
      }
    }
  });
});

module.exports = router;
