const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require("body-parser");
const urlencodedParser    = bodyParser.urlencoded({extended: false});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Барвиха рулетка | CRMP' });
});

router.post('/login', urlencodedParser, function(req, res, next) {
  const body = req.body;
  const db = new sqlite3.Database(path.resolve(__dirname, 'database.sqlite3'), (err) => {
    if (err) console.error(err.massage);
  });
  db.serialize(() => {
    if (body.nick && body.password && body.server){
      db.get(`SELECT * FROM users WHERE nick = '${body.nick}'`, (err, row) => {
        if (err) console.error(err.message);
        if (row) {
          /* Вход */
          const resp = {};
          db.get(`SELECT * FROM prize WHERE nick = '${body.nick}'`, (err, row) => {
            if (err) console.error(err.message);
            else {
              resp.prize = row.prize;
              resp.nick = row.nick;
            }
            resp.success = true;
            res.send(JSON.stringify(resp));
            db.close((err) => {
              if (err) console.error(err.message);
            });
          });
        } else {
          /* Регистрация */
          console.log("body: ", body)
          let SQL = 'INSERT INTO users (nick, password, server) values ("'+body.nick+'", "'+body.password+'", "'+body.server+'")';
          db.exec(SQL, (err) => {
            if (err) console.error(err.message);
            else res.send(JSON.stringify({
              success: true
            }));
            db.close((err) => {
              if (err) console.error(err.message);
            });
          });
        }
      });
    }
  });
});

router.post('/prize', urlencodedParser, function(req, res, next) {
  const body = req.body;
  const db = new sqlite3.Database(path.resolve(__dirname, 'database.sqlite3'), (err) => {
    if (err) console.error(err.massage);
  });
  db.serialize(() => {
    if (body.nick && body.prize){
      let SQL = 'INSERT INTO prize (nick, prize) values ("'+body.nick+'", "'+body.prize+'")';
      db.exec(SQL, (err) => {
        if (err) console.error(err.message);
        else res.send(JSON.stringify({
          success: true
        }));
        db.close((err) => {
          if (err) console.error(err.message);
        });
      });
    }
  });
});

router.post('/prize_test', urlencodedParser, function(req, res, next) {
  const body = req.body;
  const db = new sqlite3.Database(path.resolve(__dirname, 'database.sqlite3'), (err) => {
    if (err) console.error(err.massage);
  });
  db.serialize(() => {
    if (body.nick && body.prize){
      db.each(`SELECT * FROM prize WHERE nick = '${body.nick}' AND prize = '${body.prize}'`, (err) => {
        if (err) console.error(err.message);
        else res.send(JSON.stringify({
          success: true
        }));
        db.close((err) => {
          if (err) console.error(err.message);
        });
      });
    }
  });
});


module.exports = router;
