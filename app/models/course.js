const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CourseSchema = new Schema({
  courseName: String,
  campus: String,
  teacher: String,
  rate: Number,
  startDate: {
    type: Date,
    default: Date.now()
  },
  introduction: String,
  period: Number,
  totalPeriod: Number,
  price: Number,
  picUrl: String,
  tag: String
})

const Course = mongoose.model('Course', CourseSchema)
module.exports = Course
