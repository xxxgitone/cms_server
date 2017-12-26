const Renew = require('../models/renew')
const Order = require('../models/order')
const mongoose = require('mongoose')

const addAfterPayment = async (ctx) => {
  const data = ctx.request.body
  const renew = await Renew.create(data)
  const order = await Order.findById({_id: data.order})
  const renewFee = order.revenue + Number(data.renewFee)
  const newOrder = await Order.findByIdAndUpdate({_id: data.order}, {revenue: renewFee})
  ctx.body = {
    code: 0,
    renew
  }
}

module.exports = {
  addAfterPayment
}