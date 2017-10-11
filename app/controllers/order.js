const Order = require('../models/order')

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
  ])
  ctx.body = {
    code: 0,
    orders,
    total
  }
}

const addOrder = async (ctx) => {
  const orderInfo = ctx.request.body
  const order = await Order.create(orderInfo)
  ctx.body = {
    code: 0,
    order
  }
}

module.exports = {
  fetchOrders,
  addOrder
}
