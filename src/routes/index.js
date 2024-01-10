const authRoute = require('~/routes/auth.route')
const userRoute = require('~/routes/user.route')
const slideRoute = require('~/routes/slide.route')

const routes = (app) => {
  app.use('/api/auth', authRoute)
  app.use('/api/user', userRoute)
  app.use('/api/sliders', slideRoute)
}

module.exports = routes
