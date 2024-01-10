const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')
const { dirname } = require('path')
const bcrypt = require('bcrypt')
const appDir = dirname(require.main.filename)
const db = require('~/models')

const ApiError = require('~/utils/ApiError')
const ROLE_TYPES = require('~/constants/role')
const userService = require('~/services/user.service')
const roleService = require('~/services/role.service')
const authService = require('~/services/auth.service')
const tokenService = require('~/services/token.service')
const env = require('~/configs/environment')

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
    password = await bcrypt.hash(password, 8)
    user.set({ password })
    await user.save()
    return res.json({
      error: false,
      message: 'Cập nhật mật khẩu thành công'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  register,
  refreshToken,
  checkTokenEmail,
  recoverPassWord,
  sendMailGetPassWord
}
