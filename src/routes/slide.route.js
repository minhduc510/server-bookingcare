const express = require('express')
const route = express.Router()

const ROLE_TYPES = require('~/constants/role')
const validate = require('~/middleware/validate')
const authMiddleware = require('~/middleware/authMiddleware')
const slideController = require('~/controllers/slide.controller')
const slideValidation = require('~/validations/slide.validation')
const fileMiddleware = require('~/middleware/fileMiddleware')

route.get('/', slideController.getAll)
route.post(
  '/',
  authMiddleware(ROLE_TYPES.ADMIN),
  fileMiddleware.uploadSingle,
  fileMiddleware.checkFileExist,
  validate(slideValidation.slideSchema),
  slideController.createSlide
)
route.put(
  '/:slideId',
  authMiddleware(ROLE_TYPES.ADMIN),
  fileMiddleware.uploadSingle,
  validate(slideValidation.slideNotRequiredSchema),
  slideController.updateSlide
)
route.delete(
  '/:slideId',
  authMiddleware(ROLE_TYPES.ADMIN),
  slideController.deleteSlide
)
route.post(
  '/change-order',
  authMiddleware(ROLE_TYPES.ADMIN),
  validate(slideValidation.orderSchema),
  slideController.orderSlide
)

module.exports = route
