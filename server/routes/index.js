const express = require("express");
const Router = express.Router();
const Result = require("../utils/result");
const isAuth = require("../middlewares/checkauth");
const knex = require("../knex_connect");
const fs = require("fs");
const path = require("path");

const routers = [
  {
    head: "Projeler",
    endpoint: "/projects",
    table_name: "projects",
    auth: [
      {
        method: "get",
        endpoint: "/",
        middleware: isAuth,
      },
      {
        method: "post",
        endpoint: "/filters",
        middleware: isAuth,
      },
    ],
  },

  {
    head: "Fazlar",
    endpoint: "/sprints",
    table_name: "sprints",
    auth: [
      {
        method: "get",
        endpoint: "/",
        middleware: isAuth,
      },
      {
        method: "post",
        endpoint: "/filters",
        middleware: isAuth,
      },
    ],
  },

  {
    head: "Görevler",
    endpoint: "/tasks",
    table_name: "tasks",
    auth: [],
  },
];

routers.map((routeItem, index) => {
  const endpoint = routeItem.endpoint;
  const tableName = routeItem.table_name;
  const head = routeItem.head;
  const fileName = path.join(__dirname, tableName + ".js");

  const getAll = async (req, res) => {
    try {
      const result = await knex(tableName).select();
      res.json(new Result(true, head, result).send());
    } catch (error) {
      res.json(new Result(false, error.message).send());
    }
  };

  const getFilters = async (req, res) => {
    try {
      const body = req.body;

      const query = knex(tableName).select();
      if (body && body.length > 0) {
        body.map((item) => {
          query.where(item.column, item.operator, item.value);
        });
      }

      const result = await query;

      res.json(new Result(true, head, result).send());
    } catch (error) {
      res.json(new Result(false, error.message).send());
    }
  };

  const getById = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await knex(tableName).where({ id }).first();
      res.json(new Result(true, head, result).send());
    } catch (error) {
      res.json(new Result(false, error.message).send());
    }
  };

  const post = async (req, res) => {
    try {
      const body = req.body;
      const result = await knex(tableName).insert(body);
      res.json(new Result(true, head + " Eklendi", result).send());
    } catch (error) {
      res.json(new Result(false, error.message).send());
    }
  };

  const put = async (req, res) => {
    try {
      const { id } = req.params;

      const datas = {};
      Object.keys(req.body).map((key) => {
        datas[key] = req.body[key];
      });

      const result = await knex(tableName).where({ id: id }).update(datas);

      res.json(new Result(true, head + " Güncellendi", result).send());
    } catch (error) {
      res.json(new Result(false, error.message).send());
    }
  };

  const hardDelete = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await knex(tableName).where({ id }).del();
      res.json(new Result(true, head + " Silindi", result).send());
    } catch (error) {
      res.json(new Result(false, error.message).send());
    }
  };

  if (fs.existsSync(fileName)) {
    Router.use(endpoint, require(fileName));
  }

  Router.get(endpoint, getAll);
  Router.post(endpoint + "/filters", getFilters);
  Router.get(endpoint + "/:id", getById);
  Router.post(endpoint, post);
  Router.put(endpoint + "/:id", put);
  Router.delete(endpoint + "/:id", hardDelete);
});

module.exports = Router;
