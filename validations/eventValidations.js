const Joi = require("joi");

//create event validation
exports.eventValid = (_bodyValid) => {
    let joiSchema = Joi.object({
      event_name: Joi.string().min(2).max(50).required(),
      
    })
    return joiSchema.validate(_bodyValid);
  }