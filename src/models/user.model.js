'use strict'
const bcrypt = require('bcrypt')
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Role, {
        as: 'roles',
        through: models.UserRole,
        foreignKey: 'user_id'
      })
      this.belongsToMany(models.Position, {
        as: 'positions',
        through: models.PositionDoctor,
        foreignKey: 'user_id'
      })
      this.hasOne(models.OutstandingDoctor, {
        as: 'outstanding',
        foreignKey: 'user_id'
      })
      this.hasOne(models.DoctorInfo, {
        as: 'doctor_info',
        foreignKey: 'user_id'
      })
      this.hasMany(models.MedicalExaminationDay, {
        as: 'schedule_day',
        foreignKey: 'user_id'
      })
      this.hasMany(models.MedicalExaminationHour, {
        as: 'schedule_hour',
        foreignKey: 'user_id'
      })
      this.hasMany(models.Booking, {
        as: 'doctor_booking',
        foreignKey: 'doctor_id'
      })
      this.hasMany(models.Booking, {
        as: 'patient_booking',
        foreignKey: 'patient_id'
      })
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      avatar: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      status: DataTypes.INTEGER,
      typeLogin: DataTypes.INTEGER,
      lockedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'User'
    }
  )

  User.addHook('beforeCreate', async (user) => {
    if (!user.typeLogin) {
      const hashedPassword = await bcrypt.hash(
        user.password,
        8
      )
      user.password = hashedPassword
      user.fullName = user.firstName + ' ' + user.lastName
    }
  })
  User.addHook('beforeUpdate', async (user) => {
    user.fullName = user.firstName + ' ' + user.lastName
    if (!user.typeLogin) {
      const hashedPassword = await bcrypt.hash(
        user.password,
        8
      )
      user.password = hashedPassword
    }
  })
  return User
}
