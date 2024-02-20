'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Specialist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.DoctorInfo, {
        as: 'doctor',
        foreignKey: 'specialist_id'
      })
    }
  }
  Specialist.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      html: DataTypes.TEXT('long'),
      text: DataTypes.TEXT('long')
    },
    {
      sequelize,
      modelName: 'Specialist'
    }
  )
  return Specialist
}
