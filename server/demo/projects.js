const express = require("express");
const route = express.Router();
const md5 = require("md5");
const knex = require("../knex_connect");
const Result = require("../utils/Result");
const { jwtSign } = require("../utils/token");
const isAuth = require("../middlewares/checkauth");

const TABLE_NAME = "projects";

route.get("/", isAuth, async (req, res) => {
  try {
    const projects = await knex(TABLE_NAME).select();
    res.json(new Result(true, "Projeler", projects).send());
  } catch (error) {
    res.json(new Result(false, error).send());
  }
});

route.post("/filters", isAuth, async (req, res) => {
  try {
    const body = req.body;

    const query = knex(TABLE_NAME).select();
    if (body) {
      body.map((item) => {
        query.where(item.column, item.operator, item.value);
      });
    }

    const projects = await query;

    res.json(new Result(true, "Projeler", projects).send());
  } catch (error) {
    res.json(new Result(false, error).send());
  }
});

route.post("/", isAuth, async (req, res) => {
  try {
    const body = req.body;

    const datas = {};

    Object.keys(body).map((key) => {
      if (body[key].length > 0) {
        datas[key] = body[key];
      }
    });

    const project = await knex(TABLE_NAME).insert(datas);

    res.json(new Result(true, "Proje Eklendi", project).send());
  } catch (error) {
    res.json(new Result(false, error).send());
  }
});

route.get("/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    let project = await knex(TABLE_NAME).where({ id: id }).first();
    res.json(new Result(true, "Proje", project).send());
  } catch (error) {
    res.json(new Result(false, error).send());
  }
});

route.put("/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const datas = {};
    Object.keys(req.body).map((key) => {
      datas[key] = req.body[key];
    });

    const project = await knex(TABLE_NAME).where({ id: id }).update(datas);

    res.json(new Result(true, "Proje Güncellendi", project).send());
  } catch (error) {
    res.json(new Result(false, error).send());
  }
});

module.exports = route;
