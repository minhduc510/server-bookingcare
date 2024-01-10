const tokenService = require('~/services/token.service')
const ApiError = require('~/utils/ApiError')

let authMiddleware = (nameRole = null) => {
  return async (req, res, next) => {
    let tokenFromClient =
      req.body.token ||
      req.query.token ||
      req.headers.authorization

    if (tokenFromClient) {
      try {
        if (tokenFromClient.includes('Bearer')) {
          tokenFromClient = tokenFromClient.replace(
            'Bearer ',
            ''
          )
        }

        const decoded = await tokenService.verifyToken(
          tokenFromClient
        )

        req.jwtDecoded = decoded

        if (nameRole && !decoded.roles.includes(nameRole)) {
          next(
            new ApiError(
              403,
              'Access to the requested resource is forbidden.'
            )
          )
        }
        next()
      } catch (error) {
        next(new ApiError(401, 'Token Expired.'))
      }
    } else {
      next(new ApiError(403, 'No token provided.'))
    }
  }
}

module.exports = authMiddleware
