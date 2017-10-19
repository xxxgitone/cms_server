const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuditionSchema = new Schema({
  studentName: '',
  phoneNumber: '',
  birthday: '',
  parentName: '',
  gender: '',
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }
})

const Audition = mongoose.model('Audition', AuditionSchema)
module.exports = Audition
