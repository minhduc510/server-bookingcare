const Joi = require('joi')
const ROLE_TYPES = require('~/constants/role')

const authValidation = {
  registerSchema: Joi.object({
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
    gender: Joi.number().valid(0, 1).required(),
    password: Joi.string().min(4).max(191).required(),
    _type: Joi.string()
      .valid(
        ROLE_TYPES.ADMIN,
        ROLE_TYPES.DOCTOR,
        ROLE_TYPES.CLIENT
      )
      .required()
  }),

  loginSchema: Joi.object({
    email: Joi.string().email().max(191).required(),
    password: Joi.string().min(4).max(191).required()
  }),

  refreshTokenSchema: Joi.object({
    token: Joi.string().required()
  })
}

module.exports = authValidation