const Joi = require("joi");
const { now } = require("mongoose");

//create event validation
exports.eventValid = (_bodyValid) => {
  let joiSchema = Joi.object({
    event_name: Joi.string().min(2).max(50).required(),
    price: Joi.object({
      adult: Joi.number().min(0).max(10000),
      studentOrSoldier: Joi.number().min(0).max(10000),
      child: Joi.number().min(0).max(10000),
      free: Joi.boolean(),
    }),
    images: Joi.array().items(Joi.string().min(2).max(300)),
    category: Joi.string().valid('trip', 'attraction'),
    parking: Joi.string().valid('free', 'none', 'payment').required(),
    details: Joi.string().min(2).max(300),
    date_and_time: Joi.date().min('now').required(),
    during: Joi.string().min(2).max(300).required(),
    open_event: Joi.boolean().required(),
    required_equipment: Joi.string().min(2).max(300).default("none"),
    active: Joi.boolean().default(true),

  })
  return joiSchema.validate(_bodyValid);
}