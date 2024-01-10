const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const db = require('~/models')
const env = require('~/configs/environment')
const ROLE_TYPES = require('~/constants/role')
const TOKEN_TYPES = require('~/constants/token')

const decodeToken = (token) => {
  return jwt.decode(token)
}

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, env.SECRET, (error, decoded) => {
      if (error) {
        return reject(error)
      }
      resolve(decoded)
    })
  })
}

const createToken = (payload, ttl = Number(env.TTL)) => {
  return jwt.sign(payload, env.SECRET, {
    expiresIn: ttl,
    jwtid: uuidv4()
  })
}

const createAccessToken = (
  userId,
  roles = [ROLE_TYPES.CLIENT]
) => {
  return createToken({
    userId,
    roles,
    type: TOKEN_TYPES.ACCESS
  })
}

const createRefreshToken = (
  userId,
  roles = [ROLE_TYPES.CLIENT]
) => {
  return createToken(
    {
      userId,
      roles,
      type: TOKEN_TYPES.REFRESH
    },
    Number(env.REFRESH_TTL)
  )
}

const createEmailToken = (userId) => {
  return createToken(
    {
      userId,
      type: TOKEN_TYPES.EMAIL
    },
    Number(env.EMAIL_TTL)
  )
}

const insertRefreshTokenForUser = async (
  user_id,
  token
) => {
  const [response, created] =
    await db.RefreshToken.findOrCreate({
      where: { user_id },
      defaults: { user_id, token }
    })
  if (!created) {
    response.update({
      token
    })
  }
}

module.exports = {
  decodeToken,
  verifyToken,
  createEmailToken,
  createAccessToken,
  createRefreshToken,
  insertRefreshTokenForUser
}
