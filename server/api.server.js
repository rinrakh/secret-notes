'use strict';


const express = require('express');
const {unlink, writeFile} = require('fs/promises');
const path = require('path');

const dbFile = '../data/db.sqlite';
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.resolve(__dirname, dbFile));

const NOTES_PATH = path.resolve(__dirname, '../notes');

const PORT = 3001;
const app = express();

// app.use(compress());
app.use(express.json());

app.listen(PORT, () => console.log('Notes API listening at http://localhost:3001'));

function handleErrors(fn) {
  return async function(req, res, next) {
    try {
      return await fn(req, res);
    } catch (x) {
      next(x);
    }
  };
}

app.get(
  '/notes',
  handleErrors(async function(_req, res) {
    db.all(`SELECT * FROM notes`, [], (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  })
);

app.get(
  '/notes/:id',
  handleErrors(async function(req, res) {
    db.get(`SELECT * FROM notes WHERE id = $1`, [req.params.id], (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  })
);

app.post(
  '/notes',
  handleErrors(async function(req, res) {
    db.serialize(function() {
      let stmt = db.prepare(`INSERT INTO notes (title, body, created_at, updated_at) VALUES ($1, $2, $3, $3)`);
      stmt.run(req.body.title, req.body.body, new Date(), function (err) {
        if (err) throw err;
        writeFile(
          path.resolve(NOTES_PATH, `${stmt.lastID}.md`),
          req.body.body,
          'utf8'
        );
        res.json({ok: true})
      });
      stmt.finalize();
    });
  })
);
