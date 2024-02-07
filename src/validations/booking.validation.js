const Joi = require('joi')

const bookingValidation = {
  bookingSchema: Joi.object({
    doctor_id: Joi.number().required(),
    medicalexaminationday_id: Joi.number().required(),
    medicalexaminationhour_id: Joi.number().required(),
    reason: Joi.string().min(4).max(191).required()
  })
}

module.exports = bookingValidation
