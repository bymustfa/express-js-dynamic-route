const express = require("express");
const Router = express.Router();
const Result = require("../utils/result");
const isAuth = require("../middlewares/checkauth");
const knex = require("../knex_connect");
const fs = require("fs");
const path = require("path");

Router.get("/demo", (req, res) => {
  res.send("Hello World");
});

module.exports = Router;
