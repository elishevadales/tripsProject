
const Joi = require("joi");


//sign-up validations
exports.userValid = (_bodyValid) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(2).max(100).email().required(),
    password: Joi.string().min(6).max(50).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    age: Joi.number().min(1).max(120),
    district_address: Joi.string().min(2).max(100),
    about: Joi.string().min(2).max(1000),
    profile_image: Joi.string().min(2).max(1000),
    background_image: Joi.string().min(2).max(1000),
    nick_name: Joi.string().min(2).max(50),
    active: Joi.boolean(),
    role: Joi.string().valid('user', 'admin'),
    birth_date: Joi.date()
  })
  return joiSchema.validate(_bodyValid);
}

// log-in validations
exports.loginValid = (_bodyValid) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(2).max(100).email().required(),
    password: Joi.string().min(6).max(50).required(),
  })
  return joiSchema.validate(_bodyValid);
}

//update userInfo validations
exports.validUpdateUserInfo = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    gender: Joi.string().valid('male', 'female', 'other'),
    age: Joi.number().min(1).max(120).allow(""),
    district_address: Joi.string().min(2).max(100).allow(""),
    about: Joi.string().min(2).max(1000).allow(""),
    nick_name: Joi.string().min(2).max(50).default(Joi.ref('name')),
    profile_image: Joi.string().min(2).max(1000),
    background_image: Joi.string().min(2).max(1000),
    
    birth_date: Joi.date()
    
  })

  if (!_reqBody.nick_name || _reqBody.nick_name.trim() === '') {
    _reqBody.nick_name = _reqBody.name;
  }

  return joiSchema.validate(_reqBody);
}