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
    description: Joi.string().min(5),
    priceFrom: Joi.number(),
    priceTo: Joi.number(),
    specialist: Joi.number(),
    nameClinic: Joi.string().min(5).max(255),
    addressClinic: Joi.string().min(5).max(255),
    markdown: Joi.string().min(5),
    html: Joi.string().min(5),
    roles: Joi.array()
      .items(
        Joi.string().valid(
          ROLE_TYPES.ADMIN,
          ROLE_TYPES.DOCTOR,
          ROLE_TYPES.CLIENT
        )
      )
      .required(),
    positions: Joi.array().items(Joi.number())
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
    description: Joi.string().min(5),
    priceFrom: Joi.number(),
    specialist: Joi.number(),
    priceTo: Joi.number(),
    nameClinic: Joi.string().min(5).max(255),
    addressClinic: Joi.string().min(5).max(255),
    markdown: Joi.string().min(5),
    html: Joi.string().min(5),
    roles: Joi.array().items(
      Joi.string().valid(
        ROLE_TYPES.ADMIN,
        ROLE_TYPES.DOCTOR,
        ROLE_TYPES.CLIENT
      )
    ),
    positions: Joi.array().items(Joi.number())
  }),
  outstandingDoctorSchema: Joi.object({
    doctors: Joi.array().items(Joi.number()).required()
  }),
  changePasswordSchema: Joi.object({
    passwordOld: Joi.string().min(4).max(191).required(),
    passwordNew: Joi.string().min(4).max(191).required()
  })
}

module.exports = userValidation
