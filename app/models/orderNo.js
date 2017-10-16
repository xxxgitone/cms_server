const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderNoSchema = new Schema({
  name: 'orderNo',
  id: 10000
})

const OrderNo = mongoose.model('OrderNo', OrderNoSchema)
module.exports = OrderNo
