'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'MedicalExaminationHours',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        content: {
          type: Sequelize.STRING
        },
        timestampFrom: {
          type: Sequelize.STRING
        },
        timestampTo: {
          type: Sequelize.STRING
        },
        user_id: {
          type: Sequelize.INTEGER
        },
        medicalexaminationday_id: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(
      'MedicalExaminationHours'
    )
  }
}
