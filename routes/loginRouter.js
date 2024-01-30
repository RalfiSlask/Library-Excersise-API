const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const CryptoJS = require("crypto-js");
require("dotenv").config();

const key = process.env.ENCRYPTION_KEY;

const getEncryptedPassword = (password, key) => {
  return CryptoJS.AES.encrypt(password, key).toString();
};

const getDecryptedPassword = (decryptedPassword, key) => {
  return CryptoJS.AES.decrypt(decryptedPassword, key).toString(
    CryptoJS.enc.Utf8
  );
};

router.get("/register", (req, res) => {
  res.send("register route is working");
});

router.get("/", (req, res) => {
  req.app.locals.db.collection('logins').find().toArray().then(books => {
    console.log(books)
    res.send(books)
  })
});

router.post("/register", (req, res) => {
  const { email, password } = req.body;
  req.app.locals.db.collection('logins').findOne( { "email": email } ).then(emailMatches => {
    if (emailMatches) {
      res.status(400).json( { error: 'Email already in use'})
    } else {
      const encryptedPassword = getEncryptedPassword(password, key);
      req.app.locals.db.collection('logins').insertOne( {...req.body, password: encryptedPassword, id:uuidv4()} ).then(login => {
        console.log(login)
        res.status(201).json( { status: 'login added succesfully' } )
      }).catch(error => {
        console.log(error, 'could not add login')
        res.status(500).json( { error: 'could not add login'} )
      })
    }
  }).catch(error => {
    console.log(error, 'could not find login');
    res.status(500).json( {error: 'could not find login'})
  })
});

router.post("", (req, res) => {
  const { email, password } = req.body;
  req.app.locals.db.collection('logins').findOne( { "email": email }).then(emailMatches => {
    if (emailMatches) {
      console.log(email)
      res.send('email matches')
      req.app.locals.db.collection('logins').findOne( { "password": password }).then(passwordMatches => {

      }).catch(error => {
        console.log('error')
        res.status(500).json( { error: 'error'} )
      })
    } else {
      console.log('email does not exist, cant login')
      res.status(500).json( { error: 'email does not exist '})
    }
  }).catch(error => {
    console.log(error, 'error logging in');
    res.status(500).json( { error: 'error logging in' } )
  })


/*   
  fs.readFile("./logins.json", (err, loginData) => {
    if (err) {
      res.status(500).json({ err: "could not find login data" });
    } else {
      const { email, password, id } = req.body;
      const encryptedPassword = getEncryptedPassword(password, key);
      const loginArray = JSON.parse(loginData);
      const user = loginArray.find((user) => user.email === email);
      if (user) {
        const decryptedPassword = getDecryptedPassword(encryptedPassword, key);
        if (password === decryptedPassword) {
          res.json({ id: user.id, email: user.email });
        }
      } else {
        console.log(encryptedPassword);
        res.json({ exist: "does not exist" });
        console.log("user not found on server/database");
      }
    }
  }); */
});

module.exports = router;
