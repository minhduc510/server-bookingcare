const passport = require('passport')
const db = require('~/models')
const env = require('~/configs/environment')

const roleService = require('~/services/role.service')
const ROLE_TYPES = require('~/constants/role')

var GoogleStrategy =
  require('passport-google-oauth20').Strategy
var FacebookStrategy = require('passport-facebook').Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async function (
      accessToken,
      refreshToken,
      profile,
      cb
    ) {
      let [data, created] = await db.User.findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: {
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          fullName: profile.displayName,
          avatar: profile.photos[0].value,
          typeLogin: 1
        }
      })
      const user = data.get({ plain: true })
      if (created) {
        const allRole = await roleService.getRoleAll()
        let idRoles = allRole.find(
          (role) => role.name === ROLE_TYPES.CLIENT
        )
        await roleService.createRoleForUser(
          user.id,
          idRoles.id
        )
      }
      return cb(null, user.id, accessToken)
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: env.FACEBOOK_APP_ID,
      clientSecret: env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: [
        'id',
        'displayName',
        'photos',
        'email',
        'name',
        'gender'
      ]
    },
    async function (
      accessToken,
      refreshToken,
      profile,
      cb
    ) {
      let response = await db.User.findOrCreate({
        where: { email: profile.emails[0].value },
        defaults: {
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName:
            profile.name.familyName +
            ' ' +
            profile.name.middleName,
          fullName: profile.displayName,
          avatar: profile.photos[0].value,
          typeLogin: 1
        }
      })
      return cb(
        null,
        response[0].get({ plain: true }).id,
        accessToken
      )
    }
  )
)
