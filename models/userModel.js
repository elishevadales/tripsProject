const mongoose = require("mongoose");
const Joi = require("joi")

// סכמה כיצד הקולקשן/טבלה של המוצרים נראת והסוג של כל מאפיין
let userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  date_created:{
      type : Date , default : Date.now()
  }
})

// מייצר ומייצא את המודל שבנוי משם הקולקשן והסכמה שלו
// קולקשן חייב להסתיים באס אחר יהיו באגים
exports.UserModel = mongoose.model("users",userSchema);
// מודל חייב להתחיל באות גדולה

exports.userValid = (_bodyValid) =>{
  let joiSchema = Joi.object({
      name: Joi.string().min(2).max(50).required(),
      // email() -> בודק שגם האימייל לפי תבנית מייל
      email: Joi.string().min(2).max(100).email().required(),
      password: Joi.string().min(6).max(50).required(),
  })
  return joiSchema.validate(_bodyValid);
}
// התחברות
exports.loginValid = (_bodyValid) =>{
  let joiSchema = Joi.object({
      email: Joi.string().min(2).max(100).email().required(),
      password: Joi.string().min(6).max(50).required(),
  })
  return joiSchema.validate(_bodyValid);
}