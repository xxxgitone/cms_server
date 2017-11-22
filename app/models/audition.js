const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuditionSchema = new Schema({
  studentName: String,
  fromOpenid: String,
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

AuditionSchema.static('fetchAuditionByFromOpenid', function (id, cb) {
  return this
    .find({fromOpenid: id})
    .sort({date: -1})
    .populate('course')
    .exec(cb)
})

const Audition = mongoose.model('Audition', AuditionSchema)
module.exports = Audition
