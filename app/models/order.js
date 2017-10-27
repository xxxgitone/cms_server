const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  orderNo: Number,
  campus: String,
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  price: Number,
  number: Number,
  receivable: Number,
  revenue: Number,
  payment: String,
  fromOpenid: String,
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  },
  handleCampus: String,
  date: {
    type: Date,
    default: Date.now()
  },
  handlePeople: String
})

OrderSchema.static('fetchOrdersByFromOpenid', function (id, cb) {
  return this
    .find({fromOpenid: id})
    .sort({date: -1})
    .populate('student')
    .populate('course')
    .exec(cb)
})

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order
