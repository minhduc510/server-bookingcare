const Joi = require('joi')

const positionValidation = {
  positionSchema: Joi.object({
    name: Joi.string().min(4).max(191).required()
  })
}

module.exports = positionValidation
