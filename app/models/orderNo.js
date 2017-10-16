const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderNoSchema = new Schema({
  name: String,
  id: Number
})

const OrderNo = mongoose.model('OrderNo', OrderNoSchema)
module.exports = OrderNo
