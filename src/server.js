/* eslint-disable no-console */
const cors = require('cors')
const express = require('express')

const env = require('~/configs/environment')
const routes = require('~/routes')
const corsOptions = require('~/configs/cors')
const errorHandlingMiddleware = require('~/middleware/errorHandlingMiddleware')
const { CONNECT_DB } = require('./configs/sequelize')

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(express.static('public/images'))

  routes(app)

  const hostname = env.APP_HOST
  const port = env.APP_PORT

  app.get('/', async (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.use(errorHandlingMiddleware)
  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      console.log(
        'Hello MinhDuc, I am running at production'
      )
    })
  } else {
    app.listen(port, hostname, () => {
      console.log(
        `Hello MinhDuc, I am running at http://${hostname}:${port}`
      )
    })
  }
}

CONNECT_DB()
  .then(() => {
    console.log(
      'Sequelize: Connection has been established successfully.'
    )
  })
  .then(() => START_SERVER())
  .catch((error) => {
    console.error(
      'Unable to connect to the database:',
      error
    )
    process.exit(0)
  })
