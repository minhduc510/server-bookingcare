const positionService = require('~/services/position.service')

const ApiError = require('~/utils/ApiError')

const getAll = async (req, res, next) => {
  try {
    const positions = await positionService.getPositionAll()
    return res.json({
      error: false,
      data: positions
    })
  } catch (error) {
    next(error)
  }
}

const createPosition = async (req, res, next) => {
  try {
    const { name } = req.body
    await positionService.createPosition({ name })
    return res.json({
      error: false,
      data: 'Tạo thành công!'
    })
  } catch (error) {
    next(error)
  }
}

const getPosition = async (req, res, next) => {
  try {
    const { positionId } = req.params
    const position = await positionService.getPositionById(
      positionId
    )
    if (!position) {
      throw new ApiError(401, 'Unauthorized.')
    }
    return res.json({
      error: false,
      data: position
    })
  } catch (error) {
    next(error)
  }
}

const updatePosition = async (req, res, next) => {
  try {
    const { positionId } = req.params
    const data = req.body
    const position = await positionService.getPositionById(
      positionId
    )
    if (!position) {
      throw new ApiError(401, 'Unauthorized.')
    }
    await positionService.updatePositionById(
      positionId,
      data
    )
    return res.json({
      error: false,
      data: 'Cập nhật thành công!'
    })
  } catch (error) {
    next(error)
  }
}

const deletePosition = async (req, res, next) => {
  try {
    const { positionId } = req.params
    const position = await positionService.getPositionById(
      positionId
    )
    if (!position) {
      throw new ApiError(401, 'Unauthorized.')
    }
    await positionService.destroyPositionById(positionId)
    return res.json({
      error: false,
      data: 'Xóa thành công!'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  createPosition,
  getPosition,
  updatePosition,
  deletePosition
}
