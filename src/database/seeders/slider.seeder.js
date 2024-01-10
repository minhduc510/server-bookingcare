'use strict'

const db = require('../../models')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    const data = [
      {
        title: 'Nền tảng y tế chăm sóc sức khỏe toàn diện',
        image: '/slider1.png',
        order: 1
      },
      {
        title: 'Đặt lịch khám với BookingCare',
        image: '/slider2.jpg',
        order: 2
      },
      {
        title:
          'Đặt lịch chăm sóc với Wecare247 ngay tại BookingCare',
        image: '/slider3.png',
        order: 3
      }
    ]
    await db.Slider.bulkCreate(data)
  },

  async down() {
    await db.Slider.destroy({ where: {} })
  }
}
