const mongoose = require('mongoose')
const Order = require('../models/order')
const Student = require('../models/student')

const fetchOrders = async (ctx) => {
  const campus = ctx.query.campus ? {campus: ctx.query.campus} : {}
  const studentName = ctx.query.studentName ? { studentName: {
    $regex: ctx.query.studentName,
    $options: 'g'
  }} : {}
  const query = Object.assign(studentName, campus)
  const pagenum = Number(ctx.query.pagenum) || 1
  const pagesize = Number(ctx.query.pagesize) || 10
  const [
    total,
    orders
  ] = await Promise.all([
    Order.find(query).count(),
    Order.find(query)
      .skip((pagenum - 1) * pagesize)
      .limit(pagesize)
      .sort({date: -1})
      .populate('course')
      .populate('student')
      .exec()
  ])
  ctx.body = {
    code: 0,
    orders,
    total
  }
}

const addOrder = async (ctx) => {
  const form = ctx.request.body
  const courseId = new mongoose.Types.ObjectId(form.courseId)
  console.log(typeof courseId)
  const student = new Student({
    studentName: form.studentName,
    phoneNumber: form.phoneNumber,
    parentName: form.parentName,
    course: [courseId],
    revenue: form.revenue || '',
    arrears: 0,
    closed: false,
    gender: form.gender,
    birthday: form.birthday
  })

  const studentInfo = await student.save()

  const order = new Order({
    orderNo: 10001,
    course: courseId,
    student: studentInfo._id,
    number: form.number,
    payment: form.payment,
    handleCampus: form.handleCampus || '网络',
    handlePeople: form.handlePeople || '网络'
  })

  const orderInfo = await order.save()

  const data = Student.findByIdAndUpdate({_id: studentInfo._id}, {$push: {order: orderInfo._id}})
  console.log(data)
  
  ctx.body = {
    code: 0,
    order
  }
}

module.exports = {
  fetchOrders,
  addOrder
}
