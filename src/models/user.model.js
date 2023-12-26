'use strict'
const bcrypt = require('bcrypt')
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
      avatar: {
        type: DataTypes.STRING,
        defaultValue: '/avatar-default.png'
      },
      gender: DataTypes.BOOLEAN,
      roleCode: DataTypes.STRING,
      positionId: DataTypes.INTEGER
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
