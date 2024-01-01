const jwt = require("jsonwebtoken");
const {config} = require("../config/secret")

exports.createToken = (_id, role) => {
    let token = jwt.sign({ _id, role }, config.tokenSecret, { expiresIn: "600mins" });
    return token;
  }