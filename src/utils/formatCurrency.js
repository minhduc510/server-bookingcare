const formatCurrency = (price) => {
  return price.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'VND'
  })
}

module.exports = formatCurrency
