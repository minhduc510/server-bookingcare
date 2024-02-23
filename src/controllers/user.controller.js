const db = require('~/models')

const ApiError = require('~/utils/ApiError')
const ROLE_TYPES = require('~/constants/role')
const handleFile = require('~/utils/handleFile')
const userService = require('~/services/user.service')
const roleService = require('~/services/role.service')
const authService = require('~/services/auth.service')
const scheduleService = require('~/services/schedule.service')
const positionService = require('~/services/position.service')
const bookingService = require('~/services/booking.service')

const handleTrimValue = require('~/utils/handleTrimValue')

const userCurrent = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.userId
    const user = await userService.getUserById(userId)
    if (!user) {
      throw new ApiError(401, 'Unauthorized.')
    }
    const totalBooking =
      await bookingService.countBookingOfPatient(userId)
    if (!user.typeLogin) {
      user.avatar =
        req.protocol + '://' + req.get('host') + user.avatar
    }
    user.totalBooking = totalBooking
    return res.json({
      error: false,
      user
    })
  } catch (error) {
    next(error)
  }
}

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await userService.getUserById(userId, {
      include: [
        {
          model: db.Role,
          foreignKey: 'user_id',
          as: 'roles',
          attributes: ['name']
        }
      ]
    })
    if (!user) {
      throw new ApiError(401, 'Unauthorized.')
    }
    return res.json({
      error: false,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

const createUser = async (req, res, next) => {
  try {
    let { roles, positions, ...rest } = req.body
    let {
      nameClinic,
      addressClinic,
      priceFrom,
      priceTo,
      description,
      markdown,
      html,
      specialist,
      ...data
    } = rest
    const avatar = `/${req.filename}`
    if (
      await userService.checkExistsEmail(data.email.trim())
    ) {
      if (req.filename) {
        handleFile.deleteFile(avatar)
      }
      throw new ApiError(409, 'Email đã tồn tại!')
    }
    if (req.filename) {
      data = { ...data, avatar }
    }
    const dataUser = handleTrimValue(data)
    const user = await userService.createUser(dataUser)

    const allRole = await roleService.getRoleAll()

    let idRoles = allRole.filter((role) => {
      return roles.includes(role.name)
    })
    idRoles = idRoles.map((item) => item.id)
    const dataRoleUser = idRoles.map((item) => ({
      user_id: user.id,
      role_id: item
    }))

    await roleService.createBulkRoleForUser(dataRoleUser)
    if (positions && positions.length > 0) {
      const dataPositionUser = positions.map((item) => ({
        user_id: user.id,
        position_id: Number(item)
      }))
      await positionService.createBulkPositionForUser(
        dataPositionUser
      )
    }
    if (
      nameClinic &&
      addressClinic &&
      priceFrom &&
      priceTo &&
      description &&
      specialist
    ) {
      const data = {
        user_id: user.id,
        nameClinic,
        addressClinic,
        priceFrom,
        priceTo,
        description,
        specialist_id: specialist
      }
      if (markdown) {
        data.markdown = markdown
      }
      if (html) {
        data.html = html
      }
      await userService.createDoctorInfo(data)
    }
    return res.json({
      error: false,
      message: 'Tạo User thành công'
    })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const avatar = `/${req.filename}`
    let { roles, positions, ...rest } = req.body
    let {
      nameClinic,
      addressClinic,
      priceFrom,
      priceTo,
      description,
      markdown,
      html,
      specialist,
      ...data
    } = rest
    if (req.filename) {
      data = { ...data, avatar }
    }
    const user = await userService.getUserById(userId)
    if (!user) {
      if (req.filename) {
        handleFile.deleteFile(avatar)
      }
      throw new ApiError(401, 'Unauthorized.')
    }
    if (Object.keys(data).length) {
      if (
        data.email &&
        (await userService.checkExistsEmail(
          data.email.trim()
        ))
      ) {
        handleFile.deleteFile(avatar)
        throw new ApiError(409, 'Email đã tồn tại!')
      }
      const dataBody = handleTrimValue(data)
      if (
        req.filename &&
        handleFile.checkFileExist(user.avatar)
      ) {
        handleFile.deleteFile(user.avatar)
      }
      await userService.updateUserById(userId, dataBody)
    }
    if (roles && roles.length) {
      await roleService.deleteAllRoleOfUser(userId)
      const allRole = await roleService.getRoleAll()

      let idRoles = allRole.filter((role) => {
        return roles.includes(role.name)
      })
      idRoles = idRoles.map((item) => item.id)
      const dataRoleUser = idRoles.map((item) => ({
        user_id: user.id,
        role_id: item
      }))
      await roleService.createBulkRoleForUser(dataRoleUser)
    }
    if (positions && positions.length > 0) {
      await positionService.deleteBulkPositionForUser(
        user.id
      )
      const dataPositionUser = positions.map((item) => ({
        user_id: user.id,
        position_id: Number(item)
      }))
      await positionService.createBulkPositionForUser(
        dataPositionUser
      )
    }
    if (
      nameClinic &&
      addressClinic &&
      priceFrom &&
      priceTo &&
      description &&
      specialist
    ) {
      const data = {
        user_id: user.id,
        nameClinic,
        addressClinic,
        priceFrom,
        priceTo,
        description,
        specialist_id: specialist
      }
      if (markdown) {
        data.markdown = markdown
      }
      if (html) {
        data.html = html
      }
      await userService.updateDoctorInfo(userId, data)
    }
    return res.json({
      error: false,
      message: 'Cập nhật user thành công'
    })
  } catch (error) {
    next(error)
  }
}

const updatePasswordUser = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.userId
    const { passwordOld, passwordNew } = req.body
    const user = await userService.getUserById(userId)
    if (!user) {
      throw new ApiError(401, 'Unauthorized.')
    }
    const userPassword =
      await userService.getPasswordUserById(userId)
    if (
      await authService.comparePassword(
        passwordOld.trim(),
        userPassword.password
      )
    ) {
      await userService.updateUserById(userId, {
        password: passwordNew
      })
    } else {
      throw new ApiError(401, 'Mật khẩu cũ không đúng')
    }
    return res.json({
      error: false,
      message: 'Đổi mật khẩu thành công'
    })
  } catch (error) {
    next(error)
  }
}

const updateUserCurrent = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.userId
    const user = await userService.getUserById(userId)
    if (!user) {
      throw new ApiError(401, 'Unauthorized.')
    }
    if (
      req.filename &&
      handleFile.checkFileExist(user.avatar)
    ) {
      handleFile.deleteFile(user.avatar)
    }
    const dataBody = handleTrimValue(req.body)
    if (req.filename) {
      dataBody.avatar = '/' + req.filename
    }
    const userUpdated = await userService.updateUserById(
      userId,
      dataBody
    )
    const userRes = await userService.getUserById(
      userUpdated.id
    )

    if (!userRes.typeLogin) {
      userRes.avatar =
        req.protocol +
        '://' +
        req.get('host') +
        userRes.avatar
    }
    return res.json({
      error: false,
      message: 'Cập nhật thành công',
      data: userRes
    })
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await userService.getUserById(userId)
    if (!user) {
      throw new ApiError(401, 'Unauthorized.')
    }
    if (
      !user.typeLogin &&
      handleFile.checkFileExist(user.avatar)
    ) {
      handleFile.deleteFile(user.avatar)
    }
    await userService.deleteUserById(userId)
    await userService.deleteOutstandingDoctor(userId)
    await userService.deleteAllDoctorInfo(userId)
    await roleService.deleteAllRoleOfUser(userId)
    return res.json({
      error: false,
      message: 'Xóa user thành công'
    })
  } catch (error) {
    next(error)
  }
}

const getClients = async (req, res, next) => {
  try {
    const queries = {
      page: req.query.page ? req.query.page : 1
    }
    if (req.query.keyword) {
      queries.keyword = req.query.keyword
    }
    if (req.query.status) {
      queries.status = req.query.status
    }
    let clients = await userService.getAllUserClient(
      queries
    )
    const { totalUser, totalPage } =
      await userService.getTotalUserAndTotalPageByRole(
        ROLE_TYPES.CLIENT,
        queries
      )
    clients = clients.map((client) => {
      if (!client.typeLogin) {
        client.avatar =
          req.protocol +
          '://' +
          req.get('host') +
          client.avatar
        return client
      }
      return client
    })
    return res.json({
      error: false,
      data: { totalUser, totalPage, users: clients }
    })
  } catch (error) {
    next(error)
  }
}

const getDoctors = async (req, res, next) => {
  try {
    const queries = {}
    if (req.query.page) {
      queries.page = req.query.page ? req.query.page : 1
    }
    if (req.query.keyword) {
      queries.keyword = req.query.keyword
    }
    if (req.query.status) {
      queries.status = req.query.status
    }
    let doctors = await userService.getAllUserDoctor(
      queries
    )
    const { totalUser, totalPage } =
      await userService.getTotalUserAndTotalPageByRole(
        ROLE_TYPES.DOCTOR,
        queries
      )
    doctors = doctors.map((doctor) => {
      if (!doctor.typeLogin) {
        doctor.avatar =
          req.protocol +
          '://' +
          req.get('host') +
          doctor.avatar
        return doctor
      }
      return doctor
    })
    return res.json({
      error: false,
      data: { totalUser, totalPage, users: doctors }
    })
  } catch (error) {
    next(error)
  }
}

const getDoctorsDetail = async (req, res, next) => {
  try {
    const { doctorId } = req.params
    const user = await userService.getUserDoctorById(
      doctorId
    )
    if (!user) {
      throw new ApiError(401, 'Unauthorized.')
    }
    await scheduleService.removeScheduleInPastById(doctorId)
    const schedule = await scheduleService.getDays(doctorId)
    if (!user.typeLogin) {
      user.avatar =
        req.protocol + '://' + req.get('host') + user.avatar
    }
    user.schedule_day = schedule ? schedule : []
    return res.json({
      error: false,
      user
    })
  } catch (error) {
    next(error)
  }
}

const setOutstandingDoctor = async (req, res, next) => {
  try {
    const { doctors } = req.body
    await userService.deleteAllOutstandingDoctor()
    await userService.setOutstandingDoctor(
      doctors.map((item) => ({ user_id: item }))
    )
    return res.json({
      error: false,
      message: 'Cập nhật thành công'
    })
  } catch (error) {
    next(error)
  }
}

const getOutstandingDoctor = async (req, res, next) => {
  try {
    const users = await userService.getOutstandingDoctor()
    users.forEach((el) => {
      if (!el.typeLogin) {
        el.avatar =
          req.protocol + '://' + req.get('host') + el.avatar
      }
    })
    return res.json({
      error: false,
      users
    })
  } catch (error) {
    next(error)
  }
}

const updateDoctorInfo = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.userId
    const user = await userService.getUserById(userId)
    if (!user) {
      throw new ApiError(401, 'Unauthorized.')
    }
    let { positions, ...data } = req.body
    data = handleTrimValue(handleTrimValue(data))
    await userService.findOrCreateDoctorInfo(userId, {
      ...data,
      specialist_id: data.specialist
    })
    await positionService.createBulkPositionForUser(
      positions.map((item) => ({
        user_id: userId,
        position_id: item
      }))
    )
    return res.json({
      error: false,
      message: 'Cập nhật thông tin thành công'
    })
  } catch (error) {
    next(error)
  }
}

const activeUser = async (req, res, next) => {
  try {
    const { listActive } = req.body
    for (const element of listActive) {
      await userService.updateUserById(element.id, {
        status: element.checked
      })
    }
    return res.json({
      error: false,
      message: 'Cập nhật thông tin thành công'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  userCurrent,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getClients,
  getDoctors,
  activeUser,
  updateDoctorInfo,
  getDoctorsDetail,
  updateUserCurrent,
  updatePasswordUser,
  setOutstandingDoctor,
  getOutstandingDoctor
}
