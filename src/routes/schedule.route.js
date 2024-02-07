const express = require('express')
const route = express.Router()

const validate = require('~/middleware/validate')
const scheduleValidation = require('~/validations/schedule.validation')

const scheduleController = require('~/controllers/schedule.controller')

route.get('/day/:userId', scheduleController.getSchedules)

route.post(
  '/day/:userId',
  validate(scheduleValidation.scheduleSchema),
  scheduleController.createSchedules
)

route.delete('/hour/:id', scheduleController.removeHour)

module.exports = route
