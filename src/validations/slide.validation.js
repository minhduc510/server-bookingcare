const Joi = require('joi')

const slideValidation = {
  slideSchema: Joi.object({
    title: Joi.string().min(4).max(191).required()
  }),
  slideNotRequiredSchema: Joi.object({
    title: Joi.string().min(4).max(191)
  }),
  orderSchema: Joi.object({
    order: Joi.array().items(Joi.number()).required()
  })
}

module.exports = slideValidation
