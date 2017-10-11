const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WechatUserSchema = new Schema({
  openid: String,
  nickname: String,
  sex: Number,
  language: String,
  city: String,
  province: String,
  country: String,
  headimgurl: String,
  privilege: Array
})

const WechatUser = mongoose.model('WechatUser', WechatUserSchema)
module.exports = WechatUser
