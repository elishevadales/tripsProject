require("dotenv").config();

exports.config = {
    userDb:process.env.USER_DB,
    passDb:process.env.PASS_DB,
    tokenSecret:process.env.TOKEN_DB,
    admin_token:process.env.ADMIN_TOKEN,
}