const mongoose = require('mongoose')
const Student = require('../models/student')
const ObjectId = mongoose.Types.ObjectId
const util = require('../../libs/util')

const fetchStudents = async (ctx) => {
  const campus = ctx.query.campus ? {campus: ctx.query.campus} : {}
  const studentName = ctx.query.studentName ? {studentName: {$regex: ctx.query.studentName, $options: 'g'}} : {}
  const pagenum = Number(ctx.query.pagenum) || 1
  const pagesize = Number(ctx.query.pagesize) || 10
  const query = Object.assign(studentName, campus)
  const [
    total,
    students
  ] = await Promise.all([
    Student.find().count(query),
    Student.find(query)
      .skip((pagenum - 1) * pagesize)
      .limit(pagesize)
      .sort({applyDate: -1})
      .populate('order')
      .populate('course')
      .exec()
  ])
  ctx.body = {
    code: 0,
    total,
    students
  }
}

const fetchStudentsByDate = async (ctx) => {
  const date = ctx.query.date
  const campus = ctx.query.campus
  const today = util.formatDate(date)
  const students = await Student.find({campus})
  let todayStudents = []
  students.forEach(student => {
    const createDate = util.formatDate(student.applyDate)
    if (today === createDate) {
      todayStudents.push(student)
    }
  })
  ctx.body = {
    code: 0,
    count: todayStudents.length
  }
}

const deleteStudent = async (ctx) => {
  const {_id} = ctx.request.query
  if (_id.indexOf(',') > -1) {
    const _ids = _id.split(',')
    const item = await Student.remove({_id: {$in: _ids}})
    const count = item && item.result && item.result.n
    if (count > 0) {
      ctx.body = {
        code: 0,
        msg: `删除${count}条数据成功`
      }
    }
  } else {
    const item = await Student.findByIdAndRemove({_id: _id})
    if (item._id) {
      ctx.body = {
        code: 0,
        msg: '删除1条数据成功'
      }
    }
  }
}

const fetchStudentsByCourseId = async (ctx) => {
  const {_id} = ctx.request.query
  const students = await Student.find({course: `${_id}`}).populate('course').populate('order').exec()
  ctx.body = {
    code: 0,
    students
  }
}

module.exports = {
  fetchStudents,
  deleteStudent,
  fetchStudentsByDate,
  fetchStudentsByCourseId
}
