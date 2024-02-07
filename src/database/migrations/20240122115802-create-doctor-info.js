'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DoctorInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      specialist_id: {
        type: Sequelize.INTEGER
      },
      nameClinic: {
        type: Sequelize.STRING
      },
      addressClinic: {
        type: Sequelize.STRING
      },
      priceFrom: {
        type: Sequelize.INTEGER
      },
      priceTo: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      markdown: {
        type: Sequelize.TEXT
      },
      html: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DoctorInfos')
  }
}
