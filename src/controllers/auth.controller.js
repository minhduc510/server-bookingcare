const fs = require('fs')
const db = require('~/models')
const bcrypt = require('bcrypt')
const { dirname } = require('path')
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const appDir = dirname(require.main.filename)

const ApiError = require('~/utils/ApiError')
const env = require('~/configs/environment')
const ROLE_TYPES = require('~/constants/role')
const userService = require('~/services/user.service')
const roleService = require('~/services/role.service')
const authService = require('~/services/auth.service')
const tokenService = require('~/services/token.service')
const handleTrimValue = require('~/utils/handleTrimValue')

const login = async (req, res, next) => {
  try {
    const body = req.body

    const user = await userService.getUserByEmail(
      body.email,
      {
        include: [
          {
            model: db.Role,
            foreignKey: 'user_id',
            as: 'roles'
          }
        ]
      }
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

    if (!user.status) {
      throw new ApiError(
        401,
        'Tài khoản chưa được xác nhận, vui lòng đợi quản trị viên xác nhận!'
      )
    }

    const arrRole = user.roles.map((item) => item.name)

    const accessToken = tokenService.createAccessToken(
      user.id,
      arrRole
    )

    const refreshToken = tokenService.createRefreshToken(
      user.id,
      arrRole
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
    const { _type, gender, ...rest } = body
    if (
      await userService.checkExistsEmail(rest.email.trim())
    ) {
      throw new ApiError(409, 'Email đã tồn tại!')
    }

    let nameRole = ''
    if (_type === ROLE_TYPES.DOCTOR)
      nameRole = ROLE_TYPES.DOCTOR
    if (_type === ROLE_TYPES.CLIENT)
      nameRole = ROLE_TYPES.CLIENT

    const role = await roleService.getRoleByName(nameRole)

    if (!role) {
      throw new ApiError(401, 'Create Role Failed!')
    }

    let status = 1
    if (_type === ROLE_TYPES.DOCTOR) status = 0
    if (_type === ROLE_TYPES.CLIENT) status = 1

    const user = await userService.createUser({
      ...handleTrimValue(rest),
      gender,
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
      error: false,
      data: {
        accessToken: data_accessToken
      }
    })
  } catch (error) {
    next(error)
  }
}

const sendMailGetPassWord = async (req, res, next) => {
  try {
    const { email } = req.query

    const user = await userService.getUserByEmail(email)

    if (user) {
      const token = tokenService.createEmailToken(user.id)
      const linkToken =
        env.URL_CLIENT + `/get-password?token=${token}`
      var readHTMLFile = function (path, callback) {
        fs.readFile(
          path,
          { encoding: 'utf-8' },
          function (err, html) {
            if (err) {
              callback(err)
            } else {
              callback(null, html)
            }
          }
        )
      }

      var transporter = nodemailer.createTransport({
        // config mail server
        service: 'Gmail',
        auth: {
          user: env.EMAIL,
          pass: env.EMAIL_PASS
        }
      })

      readHTMLFile(
        appDir + '/pages/mail.handlebars',
        function (err, html) {
          if (err) {
            throw new ApiError(400, err)
          }
          var template = handlebars.compile(html)
          var replacements = {
            username: user.fullName,
            linkToken
          }
          var htmlToSend = template(replacements)
          var mailOptions = {
            from: 'dtranminh20@gmail.com',
            to: email,
            subject: 'Forgot Password !!!',
            html: htmlToSend
          }
          transporter.sendMail(
            mailOptions,
            function (error) {
              if (error) {
                throw new ApiError(400, error)
              } else {
                return res.json({
                  error: false,
                  message: 'Gửi email thành công'
                })
              }
            }
          )
        }
      )
    } else {
      throw new ApiError(401, 'Email không tồn tại')
    }
  } catch (error) {
    next(error)
  }
}

const checkTokenEmail = (req, res) => {
  return res.json({
    error: false,
    userId: req.jwtDecoded.userId
  })
}

const recoverPassWord = async (req, res, next) => {
  try {
    const userId = req.params.userId
    let { password } = req.body
    const user = await userService.getUserById(userId)
    if (!user) {
      throw new ApiError(401, 'Unauthorized.')
    }
    await userService.updateUserById(userId, { password })
    return res.json({
      error: false,
      message: 'Cập nhật mật khẩu thành công'
    })
  } catch (error) {
    next(error)
  }
}

const loginUserSocial = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await userService.getUserById(userId)
    if (!user) {
      throw new ApiError(401, 'Unauthorized.')
    }
    const accessToken = tokenService.createAccessToken(
      user.id,
      ROLE_TYPES.CLIENT
    )

    const refreshToken = tokenService.createRefreshToken(
      user.id,
      ROLE_TYPES.CLIENT
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

const authRoleLogin = async (req, res, next) => {
  try {
    let tokenFromClient =
      req.body.token ||
      req.query.token ||
      req.headers.authorization

    const { nameRole } = req.params

    if (tokenFromClient) {
      if (tokenFromClient.includes('Bearer')) {
        tokenFromClient = tokenFromClient.replace(
          'Bearer ',
          ''
        )
      }

      const decoded = await tokenService.verifyToken(
        tokenFromClient
      )
      if (nameRole && !decoded.roles.includes(nameRole)) {
        throw new ApiError(
          403,
          'Access to the requested resource is forbidden.'
        )
      }
    } else {
      throw new ApiError(403, 'No token provided.')
    }

    return res.json({
      error: false,
      message: 'Bạn có quyền truy cập!'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  register,
  refreshToken,
  authRoleLogin,
  loginUserSocial,
  checkTokenEmail,
  recoverPassWord,
  sendMailGetPassWord
}
