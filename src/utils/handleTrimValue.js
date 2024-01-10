function handleTrimValue(data) {
  if (Object.keys(data).length > 0) {
    const objNew = { ...data }
    for (let property in objNew) {
      if (typeof objNew[property] === 'string') {
        objNew[property] = objNew[property].trim()
      }
    }
    return objNew
  }
  return {}
}

module.exports = handleTrimValue
