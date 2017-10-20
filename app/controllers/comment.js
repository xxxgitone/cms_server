const Comment = require('../models/comment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

exports.fetchComments = async (ctx) => {
  const comments = await Comment.find({}).populate('course').populate('from')
  ctx.body = {
    code: 0,
    comments
  }
}

exports.addComment = async (ctx) => {
  const body = ctx.request.body
  const course = new ObjectId(body.course)
  const from = new ObjectId(body.from)
  const comment = new Comment({
    course,
    from,
    content: body.content
  })
  const data = await comment.save()
  ctx.body = {
    code: 0,
    comment: data
  }
}
