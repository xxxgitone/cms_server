const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TeacherSchema = new Schema({
  userName: String,
  birthday: Date,
  phoneNumber: Number,
  entryDate: {
    type: Date,
    default: Date.now()
  },
  campus: String,
  gender: {
    type: String,
    default: 'M'
  },
  job: String,
  rank: String,
  feedback: [],
  rate: Number,
  profile: String,
  avatar: String
})

const Teacher = mongoose.model('Teacher', TeacherSchema)
module.exports = Teacher
