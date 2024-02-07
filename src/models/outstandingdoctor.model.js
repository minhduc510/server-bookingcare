'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OutstandingDoctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id'
      })
    }
  }
  OutstandingDoctor.init(
    {
      user_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'OutstandingDoctor'
    }
  )
  return OutstandingDoctor
}
