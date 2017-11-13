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
  endDate: Date,
  introduction: String,
  period: Number,
  totalPeriod: Number,
  price: Number,
  picUrl: String,
  tag: String,
  courseType: {
    type: String
  }
})

CourseSchema.static('fetchCourseByType', function (type) {
  return this
    .find({courseType: type})
    .exec()
})

const Course = mongoose.model('Course', CourseSchema)
module.exports = Course
