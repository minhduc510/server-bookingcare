'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      // define association here
    }
  }
  RefreshToken.init(
    {
      user_id: DataTypes.INTEGER,
      token: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refresh_tokens'
    }
  )
  return RefreshToken
}
