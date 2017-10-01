const Student = require('../models/student')

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
    Student.find(query).skip((pagenum - 1) * pagesize)
      .limit(pagesize)
  ])
  ctx.body = {
    code: 0,
    total,
    students
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

module.exports = {
  fetchStudents,
  deleteStudent
}
