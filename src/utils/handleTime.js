const moment = require('moment')

const handleTime = {
  getTimestamp: (date, type) => {
    return moment(date, type).unix()
  },
  getTimestampEndDay: (date) => {
    return moment(date).endOf('day').unix()
  },
  format: (date, type) => {
    if (typeof date === 'number') {
      date = date * 1000
    }
    return moment(date).format(type)
  }
}

module.exports = handleTime
