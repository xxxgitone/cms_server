const Campus = require('../models/campus')

const fetchCampus = async (ctx) => {
  const campus = await Campus.find({})
  ctx.body = {
    code: 0,
    campus: campus
  }
}

const addCampus = async (ctx) => {
  const campusInfo = ctx.request.body
  const campus = await Campus.create(campusInfo)
  ctx.body = {
    code: 0,
    campus: campus
  }
}

const updateCampus = async (ctx) => {
  const campus = ctx.request.body
  const _id = campus._id
  const data = await Campus.update({_id: _id}, campus)
  if (data.n) {
    ctx.body = {
      code: 0,
      msg: `修改信息成功`
    }
  }
}

const deleteCampus = async (ctx) => {
  const {_id} = ctx.request.query
  const item = await Campus.findByIdAndRemove({_id: _id})
  if (item._id) {
    ctx.body = {
      code: 0,
      msg: '删除1条数据成功'
    }
  }
}

module.exports = {
  fetchCampus,
  addCampus,
  updateCampus,
  deleteCampus
}
