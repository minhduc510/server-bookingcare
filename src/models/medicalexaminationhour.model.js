'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class MedicalExaminationHour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.MedicalExaminationDay, {
        foreignKey: 'medicalexaminationday_id'
      })
    }
  }
  MedicalExaminationHour.init(
    {
      content: DataTypes.STRING,
      timestampFrom: DataTypes.STRING,
      timestampTo: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      medicalexaminationday_id: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'MedicalExaminationHour'
    }
  )
  return MedicalExaminationHour
}
