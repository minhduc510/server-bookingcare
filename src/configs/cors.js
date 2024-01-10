const { StatusCodes } = require('http-status-codes')

const env = require('~/configs/environment')
const ApiError = require('~/utils/ApiError')
const { WHITELIST_DOMAINS } = require('~/constants/domain')

const corsOptions = {
  origin: function (origin, callback) {
    if (env.BUILD_MODE === 'development') {
      return callback(null, true)
    }

    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }

    return callback(
      new ApiError(
        StatusCodes.FORBIDDEN,
        `${origin} not allowed by our CORS Policy.`
      )
    )
  },
  optionsSuccessStatus: 200,
  credentials: true
}

module.exports = corsOptions
