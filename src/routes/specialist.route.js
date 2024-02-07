const express = require('express')
const route = express.Router()

const ROLE_TYPES = require('~/constants/role')
const validate = require('~/middleware/validate')
const authMiddleware = require('~/middleware/authMiddleware')
const specialistController = require('~/controllers/specialist.controller')
const specialistValidation = require('~/validations/specialist.validation')
const fileMiddleware = require('~/middleware/fileMiddleware')

route.get('/', specialistController.getAll)

route.get(
  '/:id',
  fileMiddleware.uploadSingle,
  specialistController.getSpecialist
)

route.post(
  '/',
  authMiddleware(ROLE_TYPES.ADMIN),
  fileMiddleware.uploadSingle,
  fileMiddleware.checkFileExist,
  validate(specialistValidation.specialistSchema),
  specialistController.createSpecialist
)

route.put(
  '/:id',
  authMiddleware(ROLE_TYPES.ADMIN),
  fileMiddleware.uploadSingle,
  specialistController.updateSpecialist
)

route.delete(
  '/:id',
  authMiddleware(ROLE_TYPES.ADMIN),
  specialistController.deleteSpecialist
)

module.exports = route
