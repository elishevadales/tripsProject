// getting-started.js
const mongoose = require('mongoose');
const { config } = require('../config/secret');

main().catch(err => console.log(err));

async function main() {
  //אם יש באג בווינדוס 10 או 11
  // mongoose.set('strictQuery' , false);

  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.jymclmm.mongodb.net/tripsProject`);

  console.log("mongo connect started")
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}