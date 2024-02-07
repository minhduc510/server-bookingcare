'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'patient_booking',
        foreignKey: 'patient_id'
      })
      this.belongsTo(models.User, {
        as: 'doctor_booking',
        foreignKey: 'doctor_id'
      })
      this.belongsTo(models.MedicalExaminationDay, {
        as: 'day',
        foreignKey: 'medicalexaminationday_id'
      })
      this.belongsTo(models.MedicalExaminationHour, {
        as: 'hour',
        foreignKey: 'medicalexaminationhour_id'
      })
    }
  }
  Booking.init(
    {
      doctor_id: DataTypes.INTEGER,
      patient_id: DataTypes.INTEGER,
      medicalexaminationday_id: DataTypes.INTEGER,
      medicalexaminationhour_id: DataTypes.INTEGER,
      reason: DataTypes.STRING,
      status: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Booking'
    }
  )
  return Booking
}
