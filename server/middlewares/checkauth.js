const Result = require("../utils/Result");
const { jwtVerify } = require("../utils/token");
const isAuth = (request, response, next) => {
  if (request.headers.authorization) {
    const token = jwtVerify(request.headers.authorization);
    if (token) {
      const isTokenExpired = (tok) => Date.now() >= tok.exp * 1000;
      if (isTokenExpired(token)) {
        const result = new Result(false, "Oturum Süresi Doldu");
        response.status(401).json(result.send());
      } else {
        request.user = token;
        next();
      }
    } else {
      const result = new Result(false, "Yetki Tanımlanmadı");
      response.status(401).json(result.send());
    }
  } else {
    const result = new Result(false, "Yetkisiz İşlem");
    response.status(401).json(result.send());
  }
};
module.exports = isAuth;
