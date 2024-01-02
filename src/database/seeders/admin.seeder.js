'use strict'
const db = require('../../models')
const ROLE_TYPES = require('../../constants/role')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    await db.Role.bulkCreate([
      {
        name: 'Admin',
        description: 'Quản trị hệ thống'
      },
      {
        name: 'Doctor',
        description: 'Bác sĩ'
      },
      {
        name: 'Client',
        description: 'Người dùng trang web'
      }
    ])

    const admin = await db.User.create({
      email: 'admin@gmail.com',
      phone: '0912649791',
      firstName: 'Trần Minh',
      lastName: 'Đức',
      gender: 0,
      avatar: '/avatar-admin.jpg',
      password: '123456',
      status: 1
    })

    const role = await db.Role.findOne({
      name: ROLE_TYPES.ADMIN
    })

    await db.UserRole.create({
      user_id: admin.id,
      role_id: role.id
    })
  },

  async down() {
    await db.User.destroy({ where: {} })
    await db.UserRole.destroy({ where: {} })
    await db.Role.destroy({ where: {} })
  }
}
