const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuditionSchema = new Schema({
  studentName: String,
  phoneNumber: String,
  birthday: String,
  parentName: String,
  gender: String,
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  },
  createAt: {
    type: Date,
    default: Date.now()
  }
})

const Audition = mongoose.model('Audition', AuditionSchema)
module.exports = Audition
