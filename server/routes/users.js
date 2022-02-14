const express = require("express");
const route = express.Router();
const md5 = require("md5");
const knex = require("../knex_connect");
const Result = require("../utils/Result");
const { jwtSign } = require("../utils/token");
const isAuth = require("../middlewares/checkauth");

const TABLE_NAME = "users";

route.post("/", isAuth, (req, res) => {
  const datas = {
    name: req.body.name,
    email: req.body.email,
    password: md5(req.body.password),
  };

  knex(TABLE_NAME)
    .insert(datas)
    .then((data) => {
      const result = new Result(true, "Kullanıcı Oluşturuldu", data);
      res.send(result.send());
    })
    .catch((err) => {
      const result = new Result(false, "Kullanıcı Oluşturulamadı", err);
      res.send(result.send());
    });
});

route.post("/login", (req, res) => {
  const datas = {
    email: req.body.email,
    password: md5(req.body.password),
  };

  knex(TABLE_NAME)
    .where(datas)
    .then((rows) => {
      if (rows && rows.length > 0) {
        const token = jwtSign({
          id: rows[0].id,
          name: rows[0].name,
          email: rows[0].email,
        });
        const result = new Result(true, "Giriş Başarılı", token);

        res.send(result.send());
      } else {
        const result = new Result(false, "Hatalı Giriş");
        res.send(result.send());
      }
    })
    .catch((err) => {
      const result = new Result(false, "Kullanıcı Oluşturulamadı", err);
      res.send(result.send());
    });
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

    const users = await query;

    res.json(new Result(true, "Kullanıcılar", users).send());
  } catch (error) {
    res.json(new Result(false, error).send());
  }
});

module.exports = route;
