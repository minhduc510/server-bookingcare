const ApiError = require('~/utils/ApiError')
const ROLE_TYPES = require('~/constants/role')
const userService = require('~/services/user.service')
const roleService = require('~/services/role.service')
const authService = require('~/services/auth.service')
const tokenService = require('~/services/token.service')

const login = async (req, res, next) => {
  try {
    const body = req.body

    const user = await userService.getUserByEmail(
      body.email
    )
    if (!user) {
      throw new ApiError(
        401,
        'Tài khoản hoặc mật khẩu không chính xác'
      )
    }

    const isValidPassword =
      await authService.comparePassword(
        body.password,
        user.password
      )
    if (!isValidPassword) {
      throw new ApiError(
        401,
        'Tài khoản hoặc mật khẩu không chính xác'
      )
    }

    const accessToken = tokenService.createAccessToken(
      user.id
    )

    const refreshToken = tokenService.createRefreshToken(
      user.id
    )

    await tokenService.insertRefreshTokenForUser(
      user.id,
      refreshToken
    )

    return res.json({
      error: !user,
      message: !!user
        ? 'Đăng nhập thành công'
        : 'Đăng nhập thất bại',
      data: {
        accessToken,
        refreshToken
      }
    })
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const body = req.body

    if (
      await userService.checkExistsEmail(body.email.trim())
    ) {
      throw new ApiError(409, 'Email đã tồn tại!')
    }

    let nameRole = ''
    if (body._type === ROLE_TYPES.DOCTOR)
      nameRole = ROLE_TYPES.DOCTOR
    if (body._type === ROLE_TYPES.CLIENT)
      nameRole = ROLE_TYPES.CLIENT

    const role = await roleService.getRoleByName(nameRole)

    if (!role) {
      throw new ApiError(401, 'Create Role Failed!')
    }

    let status = 1
    if (body._type === ROLE_TYPES.DOCTOR) status = 0
    if (body._type === ROLE_TYPES.CLIENT) status = 1

    const user = await userService.createUser({
      email: body.email.trim(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      phone: body.phone.trim(),
      gender: body.gender.trim(),
      password: body.password.trim(),
      status
    })

    await roleService.createRoleForUser(user.id, role.id)

    return res.json({
      error: !user,
      message: !!user
        ? 'Đăng ký thành công'
        : 'Đăng ký thất bại'
    })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const token = req.param('token')
    const data_accessToken = tokenService.decodeToken(token)

    return res.json({
      data: {
        accessToken: data_accessToken
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  register,
  refreshToken
}
