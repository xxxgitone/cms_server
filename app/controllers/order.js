const mongoose = require('mongoose')
const Order = require('../models/order')
const Student = require('../models/student')
const Course = require('../models/course')
const Renew = require('../models/renew')
const OrderNo = require('../models/orderNo')
const util = require('../../libs/util')

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

const fetchOrdersCountByDate = async (ctx) => {
  const date = ctx.query.date
  const campus = ctx.query.campus
  const today = util.formatDate(date)
  const orders = await Order.find({campus})
  let todayOrders = []
  orders.forEach(order => {
    const createDate = util.formatDate(order.date)
    if (today === createDate) {
      todayOrders.push(order.revenue)
    }
  })
  const ordersCount = todayOrders.length && todayOrders.reduce((prev, next) => {
    return prev + next
  })
  ctx.body = {
    code: 0,
    count: ordersCount
  }
}

const fetchTotalSalesByDate = async (ctx) => {
  const date = ctx.query.date
  const campus = ctx.query.campus
  const today = util.formatDate(date)
  const orders = await Order.find({campus})
  let todayOrders = []
  orders.forEach(order => {
    const createDate = util.formatDate(order.date)
    if (today === createDate) {
      todayOrders.push(order.revenue)
    }
  })
  const ordersCount = todayOrders.length && todayOrders.reduce((prev, next) => {
    return prev + next
  })
  const renews = await Renew.find({campus})
  let todayRenew = []
  renews.forEach(renew => {
    const createDate = util.formatDate(renew.createAt)
    if (today === createDate) {
      todayRenew.push(renew.renewFee)
    }
  })
  const renewCount = todayRenew.length && todayRenew.reduce((prev, next) => {
    return Number(Numberprev) + Number(next)
  })
  
  ctx.body = {
    code: 0,
    count: ordersCount + renewCount
  }
}

const fetchTotalSalesByCurrentMonth = async (ctx) => {
  const currentMonth = new Date().getMonth()
  const orders = await Order.find()
  let curMonthorders = []
  orders.forEach(order => {
    const month = new Date(order.date).getMonth()
    if (currentMonth === month) {
      curMonthorders.push({
        campus: order.campus,
        revenue: order.revenue
      })
    }
  })
  const renews = await Renew.find()
  let curMonthRenews = []
  renews.forEach(renew => {
    const month = new Date(renew.createAt).getMonth()
    if (currentMonth === month) {
      curMonthRenews.push({
        campus: renew.campus,
        renewFee: renew.renewFee
      })
    }
  })

  ctx.body = {
    code: 0,
    // 当月总订单额
    curMonthorders,
    // 当月总续费额
    curMonthRenews
  }
}

let WEEKDAY = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日'  
}

const fetchTotalSalesByWeek = async (ctx) => {
  const week = util.getWeek()
  let weekdayTotalSales = []
  const orders = await Order.find()
  orders.forEach(order => {
    let totalSales = {}
    const day = new Date(order.date).getDay()
    const date = util.formatDate(order.date)
    if (week[WEEKDAY[day]] === date) {
      if (!totalSales[order.campus] || !totalSales.data) {
        totalSales.name = order.campus
        totalSales.data = []
        totalSales.data[day] = order.revenue
      } else {
        totalSales.data[day] = order.revenue
      }
      weekdayTotalSales.push(totalSales)
    }
  })
  ctx.body = {
    code: 0,
    weekdayTotalSales
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
  fetchOrdersCountByDate,
  fetchTotalSalesByDate,
  fetchTotalSalesByCurrentMonth,
  fetchTotalSalesByWeek,
  addOrder
}
