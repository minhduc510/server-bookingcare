const Joi = require('joi')

const specialistValidation = {
  specialistSchema: Joi.object({
    name: Joi.string().min(4).max(191).required(),
    html: Joi.string().required(),
    text: Joi.string().required()
  })
}

module.exports = specialistValidation
