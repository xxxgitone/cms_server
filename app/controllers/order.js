const mongoose = require('mongoose')
const Order = require('../models/order')
const Student = require('../models/student')
const Course = require('../models/course')
const OrderNo = require('../models/orderNo')

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
  const courseInfo = await Course.findById({_id: courseId})
  const student = await Student.findOne({
    studentName:form.studentName,
    phoneNumber: form.phoneNumber,
    parentName: form.parentName
  })
  let studentInfo
  if (student) {
    studentInfo = await Student.findByIdAndUpdate({_id: student._id}, {$push: {course: courseId}})
  } else {
    const student = new Student({
      fromOpenid: form.openid || '',
      studentName: form.studentName,
      phoneNumber: form.phoneNumber,
      parentName: form.parentName,
      course: [courseId],
      campus: courseInfo.campus,
      receivable: courseInfo.price,
      revenue: form.revenue || courseInfo.price,
      arrears: 0,
      closed: false,
      gender: form.gender,
      birthday: form.birthday,
      applyDate: Date.now()
    })
    studentInfo = await student.save()
  }

  const orderNo = await OrderNo
    .findOneAndUpdate({name: 'orderNo'}, {$inc: {id: 1}}, {new:true})

  const order = new Order({
    fromOpenid: form.openid || '',
    orderNo: orderNo.id,
    campus: courseInfo.campus,
    course: courseId,
    price: courseInfo.price,
    student: studentInfo._id,
    number: form.number,
    receivable: courseInfo.price,
    revenue: form.revenue || courseInfo.price,
    payment: form.payment,
    handleCampus: form.handleCampus || '网络',
    handlePeople: form.handlePeople || '网络',
    date: Date.now()
  })

  const orderInfo = await order.save()

  const data = await Student.findByIdAndUpdate({_id: studentInfo._id}, {$push: {order: orderInfo._id}})
  
  ctx.body = {
    code: 0,
    order
  }
}

module.exports = {
  fetchOrders,
  addOrder
}
