const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  account: {
    type: String,
    required: [true, 'account fields is require'],
    unique: true
  },
  userName: String,
  birthday: Date,
  phoneNumber: Number,
  entryDate: {
    type: Date,
    default: Date.now()
  },
  campus: String,
  role: String,
  password: String,
  avatar: String
})

const User = mongoose.model('User', UserSchema)
module.exports = User
