'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class DoctorInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Specialist, {
        as: 'specialist',
        foreignKey: 'specialist_id'
      })
    }
  }
  DoctorInfo.init(
    {
      user_id: DataTypes.INTEGER,
      specialist_id: DataTypes.INTEGER,
      nameClinic: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      priceFrom: DataTypes.INTEGER,
      priceTo: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      markdown: DataTypes.TEXT('long'),
      html: DataTypes.TEXT('long')
    },
    {
      sequelize,
      modelName: 'DoctorInfo'
    }
  )
  return DoctorInfo
}
