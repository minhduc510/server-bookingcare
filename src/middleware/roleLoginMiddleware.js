const ApiError = require('~/utils/ApiError')
const userService = require('~/services/user.service')

const roleLoginMiddleware = () => {
  return async (req, res, next) => {
    try {
      const type = req.body._type || req.query._type
      const { roles } =
        await userService.getRolesUserByEmail(
          req.body.email
        )
      if (roles.includes(type)) {
        next()
      } else {
        throw new ApiError(
          403,
          'Bạn không có quyền truy cập'
        )
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = roleLoginMiddleware
