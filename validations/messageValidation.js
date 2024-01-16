const Joi = require("joi");

exports.messageValid = (_bodyValid) => {
  let joiSchema = Joi.object({
    text:  Joi.string().min(0).max(5000),
    img_url: Joi.string().min(0).max(500),
    user_id: Joi.string().required(),
    event_id: Joi.string().required(),
    time_stamp: Joi.date()
  })
  return joiSchema.validate(_bodyValid);
}
