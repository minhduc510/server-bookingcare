const db = require('~/models')

const ApiError = require('~/utils/ApiError')
const ROLE_TYPES = require('~/constants/role')
const userService = require('~/services/user.service')
const roleService = require('~/services/role.service')

const handleTrimValue = require('~/utils/handleTrimValue')

const userCurrent = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded.userId
    const user = await userService.getUserById(userId)
    if (!user) {
      throw new ApiError(401, 'Unauthorized.')
    }
    user.avatar =
      req.protocol + '://' + req.get('host') + user.avatar
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
    const { roles, ...data } = req.body
    if (
      await userService.checkExistsEmail(data.email.trim())
    ) {
      throw new ApiError(409, 'Email đã tồn tại!')
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
    const { roles, ...data } = req.body
    const user = await userService.getUserById(userId)
    if (!user) {
      throw new ApiError(401, 'Unauthorized.')
    }
    if (Object.keys(data).length) {
      if (
        data.email &&
        (await userService.checkExistsEmail(
          data.email.trim()
        ))
      ) {
        throw new ApiError(409, 'Email đã tồn tại!')
      }
      const dataBody = handleTrimValue(data)
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
    return res.json({
      error: false,
      message: 'Cập nhật user thành công'
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
    await userService.deleteUserById(userId)
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
      client.avatar =
        req.protocol +
        '://' +
        req.get('host') +
        client.avatar
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
    const queries = {
      page: req.query.page ? req.query.page : 1
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
      doctor.avatar =
        req.protocol +
        '://' +
        req.get('host') +
        doctor.avatar
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

module.exports = {
  userCurrent,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getClients,
  getDoctors
}
