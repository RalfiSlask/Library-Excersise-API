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

const getArrayOfObjectWithEncryptedPassword = (
  userObject,
  encryptedPassword
) => {
  const mappedArray = loginArray.map((existingUser) => {
    if (existingUser === userObject) {
      return { ...existingUser, password: encryptedPassword };
    } else {
      return existingUser;
    }
  });
  return mappedArray;
};

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
        pasword: encryptedPassword,
      };
      users.push(newUser);
      fs.writeFile("./logins.json", JSON.stringify(users), (writeErr) => {
        if (writeErr) {
          res.status(500).json({ writeErr: "Could not write to logins" });
        }
      });
    }
  });
});

router.post("", (req, res) => {
  console.log(req.body);
  fs.readFile("./logins.json", (err, loginData) => {
    if (err) {
      res.status(500).json({ err: "could not find login data" });
    } else {
      const { email, password } = req.body;
      const key = "Salt Nyckel";
      const decryptedPassword = CryptoJS.AES.decrypt(password, key).toString(
        CryptoJS.enc.Utf8
      );
      console.log(decryptedPassword);
      const loginArray = JSON.parse(loginData);
      const user = loginArray.find((user) => {
        if (user.email === email) {
          return true;
        }
        return false;
      });
      if (user) {
        res.send("hejsan");
        console.log("hej");
      } else {
        res.json({ exist: "does not exist" });
        console.log("user not found on server/database");
      }
    }
  });
});

module.exports = router;
