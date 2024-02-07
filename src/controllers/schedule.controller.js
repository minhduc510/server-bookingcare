const scheduleService = require('~/services/schedule.service')
const userService = require('~/services/user.service')

const ApiError = require('~/utils/ApiError')
const handleTime = require('~/utils/handleTime')

const getSchedules = async (req, res, next) => {
  try {
    const { userId } = req.params
    const schedule = await scheduleService.getDays(userId)
    return res.json({ error: false, data: schedule })
  } catch (error) {
    next(error)
  }
}

const createSchedules = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { day, hours } = req.body
    if (!(await userService.getUserById(userId))) {
      throw new ApiError(401, 'Unauthorized.')
    }
    const daySchedule =
      await scheduleService.getDayByUserTimestamp(
        userId,
        day
      )
    const allHourByUser =
      await scheduleService.getAllHourUserTimestamp(userId)
    if (daySchedule) {
      let dataHour = {}
      if (
        !allHourByUser.some(
          (item) =>
            item.timestampFrom === hours.from &&
            item.timestampTo === hours.to
        )
      ) {
        dataHour = {
          medicalexaminationday_id: daySchedule.id,
          user_id: userId,
          content: `${handleTime.format(
            Number(hours.from),
            'HH:mm'
          )} - ${handleTime.format(
            Number(hours.to),
            'HH:mm'
          )}`,
          timestampFrom: hours.from,
          timestampTo: hours.to
        }
        await scheduleService.createHour(dataHour)
      }
    } else {
      const dayCreated = await scheduleService.createDay({
        user_id: userId,
        timestamp: day,
        content: handleTime.format(
          Number(day),
          'DD/MM/YYYY'
        )
      })
      let dataHour = {}
      if (
        !allHourByUser.some(
          (item) =>
            item.timestampFrom === hours.from &&
            item.timestampTo === hours.to
        )
      ) {
        dataHour = {
          medicalexaminationday_id: dayCreated.id,
          user_id: userId,
          content: `${handleTime.format(
            Number(hours.from),
            'HH:mm'
          )} - ${handleTime.format(
            Number(hours.to),
            'HH:mm'
          )}`,
          timestampFrom: hours.from,
          timestampTo: hours.to
        }
        await scheduleService.createHour(dataHour)
      }
    }
    return res.json({
      error: false,
      message: 'Tạo thành công'
    })
  } catch (error) {
    next(error)
  }
}

const removeHour = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!(await scheduleService.findHourById(id))) {
      throw new ApiError(401, 'Unauthorized.')
    }
    await scheduleService.removeHourById(id)
    return res.json({
      error: false,
      message: 'Xóa thành công!'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSchedules,
  createSchedules,
  removeHour
}
