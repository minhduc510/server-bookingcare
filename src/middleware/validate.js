const ApiError = require('~/utils/ApiError')

const validate = (schema) => {
  return async (req, res, next) => {
    const body = req.body ?? {}
    const query = req.query ?? {}
    const values = {
      ...body,
      ...query
    }

    try {
      await schema.validateAsync(values)
      next()
    } catch (err) {
      next(new ApiError(422, err.details[0].message))
    }
  }
}

module.exports = validate
