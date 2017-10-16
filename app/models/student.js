const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StudentSchema = new Schema({
  studentName: String,
  phoneNumber: Number,
  parentName: String,
  course: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  openid: String,
  startDate: Date,
  endDate: Date,
  campus: String,
  applyDate: {
    type: Date,
    default: Date.now()
  },
  order: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  receivable: Number,
  revenue: Number,
  arrears: Number,
  closed: Boolean,
  gender: {
    type: String,
    default: 'M'
  },
  birthday: Date
})

const Student = mongoose.model('Student', StudentSchema)
module.exports = Student
