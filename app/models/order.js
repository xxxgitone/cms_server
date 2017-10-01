const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  orderNo: Number,
  campus: String,
  course: String,
  price: Number,
  number: Number,
  receivable: Number,
  revenue: Number,
  payment: String,
  studentName: String,
  handleCampus: String,
  date: {
    type: Date,
    default: Date.now()
  },
  handlePeople: String
})

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order
