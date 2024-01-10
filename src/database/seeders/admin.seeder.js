'use strict'
const { faker } = require('@faker-js/faker')

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
      address: 'Hà nội',
      avatar: '/avatar-admin.jpg',
      password: '123456',
      status: 1
    })

    const role_admin = await db.Role.findOne({
      where: { name: ROLE_TYPES.ADMIN }
    })

    await db.UserRole.create({
      user_id: admin.id,
      role_id: role_admin.id
    })

    function createRandomUser() {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      return {
        id: faker.number.int({ max: 1000 }),
        firstName,
        lastName,
        fullName: firstName + ' ' + lastName,
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(true),
        password: faker.internet.password(),
        gender: Math.random() >= 0.5 ? 1 : 0,
        status: Math.random() >= 0.5 ? 1 : 0
      }
    }

    const USERS = faker.helpers.multiple(createRandomUser, {
      count: 17
    })

    const role_client = await db.Role.findOne({
      where: { name: ROLE_TYPES.CLIENT }
    })

    const ROLE_USER = USERS.map((item) => ({
      user_id: item.id,
      role_id: role_client.id
    }))

    await db.User.bulkCreate(USERS)
    await db.UserRole.bulkCreate(ROLE_USER)
  },

  async down() {
    await db.User.destroy({ where: {} })
    await db.UserRole.destroy({ where: {} })
    await db.Role.destroy({ where: {} })
  }
}
