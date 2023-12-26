const { Sequelize } = require('sequelize')

const env = require('./environment')

const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USERNAME,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    dialect: env.DB_DIALECT,
    logging: false,
    dialectOptions: {
      typeCast: function (field, next) {
        // for reading from database
        if (field.type === 'DATETIME') {
          return field.string()
        }
        return next()
      }
    },
    timezone: env.DB_TIMEZONE // for writing to database
  }
)

const CONNECT_DB = async () => {
  await sequelize.authenticate()
}

module.exports = {
  sequelize,
  CONNECT_DB
}
