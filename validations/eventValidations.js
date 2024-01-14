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
    images: Joi.array().items(Joi.string().min(2).max(1000)),
    district: Joi.string().min(2).max(100),
    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90).required(),
      long: Joi.number().min(-90).max(90).required(),
    }),
    category: Joi.string().valid('trip', 'attraction'),
    sub_category: Joi.string().min(0).max(100),
    parking: Joi.string().valid('free', 'none', 'payment').required(),
    accessibility: Joi.boolean().optional(),
    place_info: Joi.string().min(2).max(500),
    trip_details: Joi.string().min(2).max(1000),
    date_and_time: Joi.date().min('now').required(),
    during: Joi.string().min(2).max(300).required(),
    open_event: Joi.boolean().required(),
    required_equipment: Joi.string().min(2).max(300).default("none"),
    active: Joi.boolean().default(true),
    participants: Joi.array().items(Joi.object({
      user_id: Joi.string().required(), // Adjust the type based on your needs
      rank: Joi.number().integer().min(0).max(5).default(0),
    })),
  })
  return joiSchema.validate(_bodyValid);
}