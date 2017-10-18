const Course = require('../models/course')

const fetchCourse = async (ctx) => {
  const query = ctx.query
  const campus = query.campus ? {campus: query.campus} : {}
  const courseName = query.courseName ? {courseName: {$regex: query.courseName, $options: 'g'}} : {}
  const tag = query.tag ? {tag: query.tag} : {}
  const courseType = query.courseType ? {courseType: query.courseType} : {}
  const searchQuery = Object.assign(courseName, campus, tag, courseType)
  const pagenum = Number(query.pagenum) || 1
  const pagesize = Number(query.pagesize) || 16
  const [
    total,
    tags,
    course
  ] = await Promise.all([
    Course.find(searchQuery).count(),
    Course.distinct('tag'),
    Course.find(searchQuery)
      .skip((pagenum - 1) * pagesize)
      .limit(pagesize)
  ])
  ctx.body = {
    code: 0,
    course,
    tags,
    total
  }
}

const fetchCourseById = async (ctx) => {
  const _id = ctx.query._id
  const course = await Course.findOne({_id: _id})
  ctx.body = {
    code: 0,
    course
  }
}

const addCourse = async (ctx) => {
  const course = ctx.request.body
  const data = await Course.create(course)
  ctx.body = {
    code: 0,
    course: data
  }
}

const updateCourse = async (ctx) => {
  const course = ctx.request.body
  const _id = course._id
  const data = await Course.update({_id: _id}, course)
  if (data.n) {
    ctx.body = {
      code: 0,
      msg: `修改信息成功`
    }
  }
}

const deleteCourse = async (ctx) => {
  const {_id} = ctx.request.query
  const item = await Course.findByIdAndRemove({_id: _id})
  if (item._id) {
    ctx.body = {
      code: 0,
      msg: '删除1条数据成功'
    }
  }
}

module.exports = {
  fetchCourse,
  fetchCourseById,
  addCourse,
  updateCourse,
  deleteCourse
}
