const authRoute = require('~/routes/auth.route')
const userRoute = require('~/routes/user.route')
const slideRoute = require('~/routes/slide.route')
const positionRoute = require('~/routes/position.route')
const scheduleRoute = require('~/routes/schedule.route')
const bookingRoute = require('~/routes/booking.route')
const specialistRoute = require('~/routes/specialist.route')

const routes = (app) => {
  app.use('/api/auth', authRoute)
  app.use('/api/user', userRoute)
  app.use('/api/sliders', slideRoute)
  app.use('/api/positions', positionRoute)
  app.use('/api/schedules', scheduleRoute)
  app.use('/api/bookings', bookingRoute)
  app.use('/api/specialists', specialistRoute)
}

module.exports = routes
