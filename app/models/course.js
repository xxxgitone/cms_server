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
  classTime: String,
  courseType: {
    type: String
  }
})

CourseSchema.static('fetchCourseByName', function (name) {
  return this
    .find({courseName: {$regex: name, $options: 'g'}})
    .exec()
})

CourseSchema.static('fetchCourseByTag', function (tag) {
  return this
    .find({tag: {$regex: tag, $options: 'g'}})
    .exec()
})

const Course = mongoose.model('Course', CourseSchema)
module.exports = Course
