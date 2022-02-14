const express = require("express");
const app = express();
const cors = require("cors");
const { API_VERSION, PORT } = require("./config/env");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(API_VERSION + "users", require("./routes/users"));

app.use(API_VERSION, require("./routes/index"));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
