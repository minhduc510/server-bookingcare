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
      avatar: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      status: DataTypes.INTEGER,
      lockedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'User'
    }
  )
  User.addHook('beforeValidate', (user) => {
    user.fullName = user.firstName + ' ' + user.lastName
  })

  User.addHook('beforeCreate', async (user) => {
    const hashedPassword = await bcrypt.hash(
      user.password,
      8
    )
    user.password = hashedPassword
  })
  return User
}
