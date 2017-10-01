const mongoose = require('mongoose')
const Schema = mongoose.Schema

const campusSchema = new Schema({
  campusName: String,
  principal: String,
  telephone: Number,
  buildDate: Date,
  picUrl: String
})

const Campus = mongoose.model('Campus', campusSchema)
module.exports = Campus
