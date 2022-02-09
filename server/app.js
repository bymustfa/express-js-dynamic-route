const express = require("express");
const app = express();
const { API_VERSION, PORT } = require("./config/env");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/users", require("./demo/users"));

app.use(API_VERSION, require("./routes/index"));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
