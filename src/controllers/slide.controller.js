const slideService = require('~/services/slide.service')
const ApiError = require('~/utils/ApiError')
const handleFile = require('~/utils/handleFile')

const getAll = async (req, res, next) => {
  try {
    const sliders = await slideService.getAll()
    for (const element of sliders) {
      element.image =
        req.protocol +
        '://' +
        req.get('host') +
        element.image
    }
    return res.json({
      error: false,
      data: sliders
    })
  } catch (error) {
    next(error)
  }
}

const createSlide = async (req, res, next) => {
  try {
    const orderLastNumber =
      await slideService.getOrderLastNumber()
    const data = {
      title: req.body.title,
      image: '/' + req.filename,
      order: orderLastNumber + 1
    }
    await slideService.createSlide(data)
    return res.json({
      error: false,
      message: 'Thêm slide thành công'
    })
  } catch (error) {
    next(error)
  }
}

const updateSlide = async (req, res, next) => {
  try {
    const data = {}
    const slideId = req.params.slideId
    const slideOld = await slideService.getSlideById(
      slideId
    )
    if (!slideOld) {
      throw new ApiError(401, 'Unauthorize.')
    }
    if (req.body.title) {
      data.title = req.body.title
    }
    if (req.filename) {
      handleFile.deleteFile(slideOld.image)
      data.image = '/' + req.filename
    }
    await slideService.updateSlide(slideId, data)
    return res.json({
      error: false,
      message: 'Cập nhật slide thành công'
    })
  } catch (error) {
    next(error)
  }
}

const deleteSlide = async (req, res, next) => {
  try {
    const slideId = req.params.slideId
    if (!slideId) {
      throw new ApiError(401, 'Unauthorize.')
    }
    const slideOld = await slideService.getSlideById(
      slideId
    )
    handleFile.deleteFile(slideOld.image)
    await slideService.deleteSlide(slideId)
    return res.json({
      error: false,
      message: 'Xóa slide thành công'
    })
  } catch (error) {
    next(error)
  }
}

const orderSlide = async (req, res, next) => {
  try {
    const listOrder = req.query.order
    const slices = await slideService.getAll()
    if (listOrder.length !== slices.length) {
      throw new ApiError(
        404,
        'The length order is not equal to the slide length.'
      )
    }
    for (let i = 0; i < slices.length; i++) {
      await slideService.updateSlide(listOrder[i], {
        order: i + 1
      })
    }
    return res.json({
      error: false,
      message: 'Cập nhật thứ tự thành công.'
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  createSlide,
  updateSlide,
  deleteSlide,
  orderSlide
}
