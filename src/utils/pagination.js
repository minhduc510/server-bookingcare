const env = require('~/configs/environment')

const paginate = (page) => {
  const pageSize = env.ITEM_PER_PAGE
  const offset = (page - 1) * pageSize
  const limit = pageSize

  return {
    offset,
    limit
  }
}

module.exports = paginate
