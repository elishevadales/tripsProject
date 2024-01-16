require("dotenv").config();

exports.config = {
    userDb:process.env.USER_DB,
    passDb:process.env.PASS_DB,
    tokenSecret:process.env.TOKEN_DB,
    admin_token:process.env.ADMIN_TOKEN,
    email:process.env.EMAIL,
    email_pass:process.env.EMAIL_PASS,
    servrt_url:process.env.SERVRT_URL,
    client_url:process.env.CLIENT_URL,
}