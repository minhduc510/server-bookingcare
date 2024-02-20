const specialistService = require('~/services/specialist.service')
const scheduleService = require('~/services/schedule.service')
const ApiError = require('~/utils/ApiError')
const handleFile = require('~/utils/handleFile')

const getAll = async (req, res, next) => {
  try {
    const specialists =
      await specialistService.getAllSpecialist()
    for (const element of specialists) {
      element.image =
        req.protocol +
        '://' +
        req.get('host') +
        '/' +
        element.image
    }
    return res.json({
      error: false,
      data: specialists
    })
  } catch (error) {
    next(error)
  }
}

const getSpecialist = async (req, res, next) => {
  try {
    const { id } = req.params
    const specialist =
      await specialistService.getSpecialist(id)
    specialist.image =
      req.protocol +
      '://' +
      req.get('host') +
      '/' +
      specialist.image
    for (let i = 0; i < specialist.doctor.length; i++) {
      const schedule = await scheduleService.getDays(
        specialist.doctor[i]
      )
      specialist.doctor[i].avatar =
        req.protocol +
        '://' +
        req.get('host') +
        specialist.doctor[i].avatar
      specialist.doctor[i].schedule_day = schedule
        ? schedule
        : []
    }
    return res.json({
      error: false,
      data: specialist
    })
  } catch (error) {
    next(error)
  }
}

const createSpecialist = async (req, res, next) => {
  try {
    const { name, html, text } = req.body
    await specialistService.createSpecialist({
      name,
      html,
      text,
      image: req.filename
    })
    return res.json({
      error: false,
      message: 'Tạo thành công'
    })
  } catch (error) {
    next(error)
  }
}

const updateSpecialist = async (req, res, next) => {
  try {
    const { id } = req.params
    const specialist =
      await specialistService.getSpecialist(id)
    if (!specialist) {
      throw new ApiError(401, 'Unauthorize.')
    }
    const data = req.body
    if (req.filename) {
      data.image = req.filename
      handleFile.deleteFile(`/${specialist.image}`)
    }
    await specialistService.updateSpecialist(id, data)
    return res.json({
      error: false,
      message: 'Cập nhật thành công'
    })
  } catch (error) {
    next(error)
  }
}

const deleteSpecialist = async (req, res, next) => {
  try {
    const { id } = req.params
    const specialist =
      await specialistService.getSpecialist(id)
    if (!specialist) {
      throw new ApiError(401, 'Unauthorize.')
    }
    handleFile.deleteFile(`/${specialist.image}`)
    await specialistService.removeSpecialist(id)
    return res.json({
      error: false,
      message: 'Xóa thành công'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  createSpecialist,
  updateSpecialist,
  deleteSpecialist,
  getSpecialist
}
