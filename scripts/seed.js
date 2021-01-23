'use strict';

const path = require('path');
const dbFile = '../data/db.sqlite';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path.resolve(__dirname, dbFile));

const now = new Date();
const startOfYear = require('date-fns/startOfYear');
const startOfThisYear = startOfYear(now);
function randomDateBetween(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

const dropTableNotes = `DROP TABLE IF EXISTS notes;`;
const createTableNotes = `CREATE TABLE notes(
  id INTEGER PRIMARY KEY NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  title VARCHAR(255) NOT NULL,
  body CLOB NOT NULL
)`;
const insertNoteStatement = `INSERT INTO notes(title, body, created_at, updated_at) VALUES ($1, $2, $3, $3)`;
const seedData = [
  [
    'Meeting Notes',
    'This is an example note. It contains **Markdown**!',
    randomDateBetween(startOfThisYear, now),
  ],
  [
    'Make a thing',
    `It's very easy to make some words **bold** and other words *italic* with
Markdown. You can even [link to React's website!](https://www.reactjs.org).`,
    randomDateBetween(startOfThisYear, now),
  ],
  [
    'A note with a very long title because sometimes you need more words',
    `You can write all kinds of [amazing](https://en.wikipedia.org/wiki/The_Amazing)
notes in this app! These note live on the server in the \`notes\` folder.

![This app is powered by React](https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/React_Native_Logo.png/800px-React_Native_Logo.png)`,
    randomDateBetween(startOfThisYear, now),
  ],
  ['I wrote this note today', 'It was an excellent note.', now],
];

async function seed() {
  db.serialize(() => {
    db.run(dropTableNotes);
    db.run(createTableNotes);
    seedData.map((row) => db.run(insertNoteStatement, row));
  });
}

seed();
