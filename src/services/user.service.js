/* eslint-disable no-unused-vars */
var { Op } = require('sequelize')

const db = require('~/models')
const paginate = require('~/utils/pagination')
const ROLE_TYPES = require('~/constants/role')
const roleService = require('~/services/role.service')
const env = require('~/configs/environment')

const createUser = async (data) => {
  const user = await db.User.create(data)
  return user
}

const getUserById = async (id, options) => {
  return await db.User.findOne({
    where: { id },
    attributes: [
      'id',
      'firstName',
      'lastName',
      'email',
      'phone',
      'avatar',
      'address',
      'gender'
    ],
    ...options
  })
}

const getUserByEmail = async (email, options) => {
  return await db.User.findOne({
    where: { email },
    ...options
  })
}

const updateUserById = async (id, options) => {
  const user = await db.User.findOne({ where: { id } })
  user.set(options)
  return await user.save()
}

const checkExistsEmail = async (email) => {
  return !!(await getUserByEmail(email))
}

const deleteUserById = async (id) => {
  return await db.User.destroy({ where: { id } })
}

const deleteAll = async () => {
  return await db.User.destroy({ where: {} })
}

const getAllUserClient = async (options) => {
  const { page, ...queries } = options
  let dataQueries = {}
  if (queries.keyword) {
    const dataSearch = {
      [Op.or]: [
        {
          fullname: {
            [Op.like]: `%${queries.keyword}%`
          }
        },
        {
          email: {
            [Op.like]: `%${queries.keyword}%`
          }
        },
        {
          phone: {
            [Op.like]: `%${queries.keyword}%`
          }
        },
        {
          address: {
            [Op.like]: `%${queries.keyword}%`
          }
        }
      ]
    }
    dataQueries = { ...dataQueries, ...dataSearch }
  }
  if (queries.status) {
    const dataStatus = { status: queries.status }
    dataQueries = { ...dataQueries, ...dataStatus }
  }

  const role = await roleService.getRoleByName(
    ROLE_TYPES.CLIENT
  )
  let usersData = await role.getUsers({
    where: { ...dataQueries },
    order: [['updatedAt', 'DESC']],
    attributes: [
      'id',
      'firstName',
      'lastName',
      'fullName',
      'email',
      'phone',
      'avatar',
      'address',
      'gender',
      'status',
      'updatedAt'
    ],
    include: [
      {
        model: db.Role,
        foreignKey: 'user_id',
        as: 'roles',
        attributes: ['name']
      }
    ],
    ...paginate(page)
  })
  usersData = usersData.map((el) => el.get({ plain: true }))
  return usersData.map((user) => {
    user.roles = user.roles.map((role) => role.name)
    delete user.UserRole
    return user
  })
}

const getAllUserDoctor = async (options) => {
  const { page, ...queries } = options
  let dataQueries = {}
  if (queries.keyword) {
    const dataSearch = {
      [Op.or]: [
        {
          fullname: {
            [Op.like]: `%${queries.keyword}%`
          }
        },
        {
          email: {
            [Op.like]: `%${queries.keyword}%`
          }
        },
        {
          phone: {
            [Op.like]: `%${queries.keyword}%`
          }
        },
        {
          address: {
            [Op.like]: `%${queries.keyword}%`
          }
        }
      ]
    }
    dataQueries = { ...dataQueries, ...dataSearch }
  }
  if (queries.status) {
    const dataStatus = { status: queries.status }
    dataQueries = { ...dataQueries, ...dataStatus }
  }

  const role = await roleService.getRoleByName(
    ROLE_TYPES.DOCTOR
  )
  let usersData = await role.getUsers({
    where: { ...dataQueries },
    order: [['updatedAt', 'DESC']],
    attributes: [
      'id',
      'firstName',
      'lastName',
      'fullName',
      'email',
      'phone',
      'avatar',
      'address',
      'gender',
      'status',
      'updatedAt'
    ],
    include: [
      {
        model: db.Role,
        foreignKey: 'user_id',
        as: 'roles',
        attributes: ['name']
      }
    ],
    ...paginate(page)
  })
  usersData = usersData.map((el) => el.get({ plain: true }))
  return usersData.map((user) => {
    user.roles = user.roles.map((role) => role.name)
    delete user.UserRole
    return user
  })
}

const getTotalUserAndTotalPageByRole = async (
  roleName,
  options
) => {
  const { page, ...queries } = options
  let dataQueries = {}
  if (queries.keyword) {
    const dataSearch = {
      [Op.or]: [
        {
          fullname: {
            [Op.like]: `%${queries.keyword}%`
          }
        },
        {
          email: {
            [Op.like]: `%${queries.keyword}%`
          }
        },
        {
          phone: {
            [Op.like]: `%${queries.keyword}%`
          }
        },
        {
          address: {
            [Op.like]: `%${queries.keyword}%`
          }
        }
      ]
    }
    dataQueries = { ...dataQueries, ...dataSearch }
  }
  if (queries.status) {
    const dataStatus = { status: queries.status }
    dataQueries = { ...dataQueries, ...dataStatus }
  }

  const role = await roleService.getRoleByName(roleName)
  const users = await role.getUsers({
    where: { ...dataQueries }
  })
  return {
    totalUser: users.length,
    totalPage: Math.ceil(users.length / env.ITEM_PER_PAGE)
  }
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  checkExistsEmail,
  deleteUserById,
  updateUserById,
  deleteAll,
  getAllUserClient,
  getAllUserDoctor,
  getTotalUserAndTotalPageByRole
}
