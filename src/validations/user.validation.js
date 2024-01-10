const Joi = require('joi')
const ROLE_TYPES = require('~/constants/role')

const userValidation = {
  userSchema: Joi.object({
    email: Joi.string().email().max(191).required(),
    phone: Joi.string()
      .min(2)
      .max(191)
      .pattern(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)
      .required()
      .messages({
        'string.pattern.base':
          'Phone is not in the correct format'
      }),
    firstName: Joi.string().min(2).max(191).required(),
    lastName: Joi.string().min(2).max(191).required(),
    address: Joi.string().min(5).max(255).required(),
    gender: Joi.number().valid(0, 1).required(),
    password: Joi.string().min(4).max(191).required(),
    roles: Joi.array()
      .items(
        Joi.string().valid(
          ROLE_TYPES.ADMIN,
          ROLE_TYPES.DOCTOR,
          ROLE_TYPES.CLIENT
        )
      )
      .required()
  }),
  userNotRequiredSchema: Joi.object({
    email: Joi.string().email().max(191),
    phone: Joi.string()
      .min(2)
      .max(191)
      .pattern(/(84|0[3|5|7|8|9])+([0-9]{8})\b/)

      .messages({
        'string.pattern.base':
          'Phone is not in the correct format'
      }),
    firstName: Joi.string().min(2).max(191),
    lastName: Joi.string().min(2).max(191),
    gender: Joi.number().valid(0, 1),
    address: Joi.string().min(5).max(255),
    password: Joi.string().min(4).max(191),
    roles: Joi.array().items(
      Joi.string().valid(
        ROLE_TYPES.ADMIN,
        ROLE_TYPES.DOCTOR,
        ROLE_TYPES.CLIENT
      )
    )
  })
}

module.exports = userValidation
