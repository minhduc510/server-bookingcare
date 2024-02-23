/* eslint-disable no-unused-vars */
var { Op } = require('sequelize')

const db = require('~/models')
const env = require('~/configs/environment')
const paginate = require('~/utils/pagination')
const ROLE_TYPES = require('~/constants/role')
const handleTime = require('~/utils/handleTime')
const roleService = require('~/services/role.service')

const createUser = async (data) => {
  const user = await db.User.create(data)
  return user
}

const getUserById = async (id, options) => {
  const user = await db.User.findOne({
    where: { id },
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
      'typeLogin'
    ],
    ...options
  })
  return user.get({ plain: true })
}

const getUserDoctorById = async (id) => {
  let user = await db.User.findOne({
    where: { id },
    attributes: [
      'id',
      'fullName',
      'firstName',
      'lastName',
      'email',
      'phone',
      'avatar',
      'address',
      'status',
      'gender',
      'typeLogin'
    ],
    include: [
      {
        model: db.DoctorInfo,
        foreignKey: 'user_id',
        as: 'doctor_info',
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [
          {
            model: db.Specialist,
            foreignKey: 'specialist_id',
            as: 'specialist',
            attributes: ['id', 'name']
          }
        ]
      },
      {
        model: db.Position,
        foreignKey: 'user_id',
        as: 'positions',
        attributes: ['id', 'name']
      },
      {
        model: db.Role,
        foreignKey: 'user_id',
        as: 'roles',
        attributes: ['id', 'name']
      }
    ]
  })
  user = user.get({ plain: true })
  if (user.positions.length > 0) {
    user.positions = user.positions.map((item) => ({
      id: item.id,
      name: item.name.trim()
    }))
  }
  if (user.roles.length > 0) {
    user.roles = user.roles.map((item) => item.name.trim())
  }
  return user
}

const getUserByEmail = async (email, options) => {
  return await db.User.findOne({
    where: { email },
    ...options
  })
}

const getPasswordUserById = async (id) => {
  const user = await db.User.findOne({
    where: { id },
    attributes: ['password']
  })
  return user.get({ plain: true })
}

const getRolesUserByEmail = async (email) => {
  let user = await db.User.findOne({
    where: { email },
    include: [
      {
        model: db.Role,
        foreignKey: 'user_id',
        as: 'roles',
        attributes: ['name']
      }
    ]
  })
  user = user.get({ plain: true })
  user.roles = user.roles.map((item) => item.name)
  return user
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
      'updatedAt',
      'typeLogin'
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
  const pagination = page ? { ...paginate(page) } : {}
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
      'updatedAt',
      'typeLogin'
    ],
    include: [
      {
        model: db.Role,
        foreignKey: 'user_id',
        as: 'roles',
        attributes: ['name']
      },
      {
        model: db.Position,
        foreignKey: 'user_id',
        as: 'positions',
        attributes: ['id', 'name']
      },
      {
        model: db.OutstandingDoctor,
        foreignKey: 'user_id',
        as: 'outstanding',
        attributes: ['user_id']
      }
    ],
    ...pagination
  })
  usersData = usersData.map((el) => el.get({ plain: true }))
  return usersData.map((user) => {
    user.roles = user.roles.map((role) => role.name)
    user.positions = user.positions.map((position) => ({
      id: position.id,
      name: position.name
    }))
    user.outstanding = !!user.outstanding
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

const getOutstandingDoctor = async (ids) => {
  let usersData = await db.OutstandingDoctor.findAll({
    include: [
      {
        model: db.User,
        as: 'user',
        foreignKey: 'user_id',
        include: [
          {
            model: db.Position,
            as: 'positions',
            foreignKey: 'user_id'
          },
          {
            model: db.DoctorInfo,
            as: 'doctor_info',
            foreignKey: 'user_id',
            include: [
              {
                model: db.Specialist,
                as: 'specialist',
                foreignKey: 'specialist_id'
              }
            ]
          }
        ]
      }
    ]
  })
  usersData = usersData.map((el) => el.get({ plain: true }))
  usersData = usersData.map((el) => ({
    id: el.user.id,
    firstName: el.user.firstName,
    lastName: el.user.lastName,
    fullName: el.user.fullName,
    email: el.user.email,
    phone: el.user.phone,
    address: el.user.address,
    avatar: el.user.avatar,
    positions: el.user.positions.map((item) => item.name),
    specialist: el.user.doctor_info.specialist.name
  }))
  return usersData
}

const setOutstandingDoctor = async (ids) => {
  return await db.OutstandingDoctor.bulkCreate(ids)
}

const deleteOutstandingDoctor = async (user_id) => {
  return await db.OutstandingDoctor.destroy({
    where: { user_id }
  })
}

const deleteAllOutstandingDoctor = async () => {
  return await db.OutstandingDoctor.destroy({ where: {} })
}

const createDoctorInfo = async (data) => {
  const user = await db.DoctorInfo.create(data)
  return user
}

const findOrCreateDoctorInfo = async (user_id, data) => {
  const user = await db.DoctorInfo.findOrCreate({
    where: { user_id },
    defaults: data
  })
  return user
}

const updateDoctorInfo = async (user_id, data) => {
  const user = await db.DoctorInfo.findOne({
    where: { user_id }
  })
  user.set(data)
  return await user.save()
}

const deleteAllDoctorInfo = async (user_id) => {
  const user = await db.DoctorInfo.findOne({
    where: { user_id }
  })
  if (user) {
    await db.DoctorInfo.destroy({ where: { user_id } })
  }
  return await user
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  checkExistsEmail,
  deleteUserById,
  updateUserById,
  getUserDoctorById,
  deleteAll,
  getAllUserClient,
  getAllUserDoctor,
  findOrCreateDoctorInfo,
  setOutstandingDoctor,
  getPasswordUserById,
  getOutstandingDoctor,
  getTotalUserAndTotalPageByRole,
  deleteAllOutstandingDoctor,
  createDoctorInfo,
  deleteAllDoctorInfo,
  updateDoctorInfo,
  getRolesUserByEmail,
  deleteOutstandingDoctor
}
