const jwt = require("jsonwebtoken");

const SECRET_KEY = "Ijkası5y78s";

const jwtSign = (datas) =>
  jwt.sign(datas, SECRET_KEY, {
    expiresIn: "2h",
  });

const jwtVerify = (token) =>
  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      return false;
    }
    return decoded;
  });

module.exports = {
  jwtSign,
  jwtVerify,
};
