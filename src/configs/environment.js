require('dotenv').config()

const env = {
  // Config Database
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_TIMEZONE: process.env.DB_TIMEZONE,

  // Config App
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,

  // Config Mode
  BUILD_MODE: process.env.BUILD_MODE,

  // Config Token
  TTL: process.env.JWT_TTL,
  REFRESH_TTL: process.env.JWT_REFRESH_TTL,
  SECRET: process.env.JWT_SECRET
}

module.exports = env
