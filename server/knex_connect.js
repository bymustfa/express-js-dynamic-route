const knex = require("knex")({
  client: "sqlite3", // or 'better-sqlite3'
  connection: {
    filename: "./db.sqlite",
  },
  useNullAsDefault: true,
});

module.exports = knex;
