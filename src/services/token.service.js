const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const db = require('~/models')
const env = require('~/configs/environment')
const TOKEN_TYPES = require('~/constants/token')

const decodeToken = (token) => {
  return jwt.decode(token)
}

const createToken = (payload, ttl = Number(env.TTL)) => {
  return jwt.sign(payload, env.SECRET, {
    expiresIn: ttl,
    jwtid: uuidv4()
  })
}

const createAccessToken = (userId) => {
  return createToken({
    userId,
    type: TOKEN_TYPES.ACCESS
  })
}

const createRefreshToken = (userId) => {
  return createToken(
    {
      userId,
      type: TOKEN_TYPES.REFRESH
    },
    Number(env.REFRESH_TTL)
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
  createAccessToken,
  createRefreshToken,
  insertRefreshTokenForUser
}
