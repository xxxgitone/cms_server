const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema({
  course: {
    type: ObjectId, 
    ref: 'Course'
  },
  from: {
    type: ObjectId, 
    ref: 'WechatUser'
  },
  reply: [{
    from: {
      type: ObjectId, 
      ref: 'User'
    },
    to: {
      type: ObjectId, 
      ref: 'WechatUser'
    },
    content: String
  }],
  content: String,
  createAt: {
    type: Date,
    default: Date.now()
  }
})

const Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment
