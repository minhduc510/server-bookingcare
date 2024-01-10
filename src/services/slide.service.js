const db = require('~/models')

const getAll = async () => {
  const sliders = await db.Slider.findAll({
    order: [['order', 'ASC']],
    attributes: ['id', 'image', 'title', 'order']
  })
  return sliders
}

const getSlideById = async (id) => {
  const slider = await db.Slider.findOne({
    where: { id },
    attributes: ['id', 'image', 'title', 'order']
  })
  return slider
}

const createSlide = async (body) => {
  const slider = await db.Slider.create(body)
  return slider
}

const updateSlide = async (id, body) => {
  const slider = await db.Slider.update(body, {
    where: { id }
  })
  return slider
}

const deleteSlide = async (id) => {
  const slider = await db.Slider.destroy({ where: { id } })
  return slider
}

const getOrderLastNumber = async () => {
  const slider = await db.Slider.findOne({
    order: [['order', 'DESC']]
  })
  return slider.order
}

module.exports = {
  getAll,
  createSlide,
  updateSlide,
  deleteSlide,
  getSlideById,
  getOrderLastNumber
}
