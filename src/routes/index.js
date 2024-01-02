const authRoute = require('~/routes/auth.route')

const routes = (app) => {
  app.use('/api/auth', authRoute)
}

module.exports = routes
