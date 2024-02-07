const Joi = require('joi')

const scheduleValidation = {
  scheduleSchema: Joi.object({
    day: Joi.number().required(),
    hours: Joi.object({
      from: Joi.number().required(),
      to: Joi.number().required()
    }).required()
  })
}

module.exports = scheduleValidation
