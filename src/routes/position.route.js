const express = require('express')
const route = express.Router()

const ROLE_TYPES = require('~/constants/role')
const validate = require('~/middleware/validate')
const positionController = require('~/controllers/position.controller')
const authMiddleware = require('~/middleware/authMiddleware')
const positionValidation = require('~/validations/position.validation')

route.get(
  '/',
  authMiddleware(ROLE_TYPES.ADMIN),
  positionController.getAll
)

route.post(
  '/',
  authMiddleware(ROLE_TYPES.ADMIN),
  validate(positionValidation.positionSchema),
  positionController.createPosition
)

route.get(
  '/:positionId',
  authMiddleware(ROLE_TYPES.ADMIN),
  positionController.getPosition
)

route.put(
  '/:positionId',
  authMiddleware(ROLE_TYPES.ADMIN),
  validate(positionValidation.positionSchema),
  positionController.updatePosition
)

route.delete(
  '/:positionId',
  authMiddleware(ROLE_TYPES.ADMIN),
  positionController.deletePosition
)

module.exports = route
