const Comment = require('../models/comment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

exports.fetchComments = async (ctx) => {
  const courseId = ctx.query.courseId || ''
  const type = ctx.query.type || ''
  const comments = await Comment.fetchCommentsByCourseId(courseId, type)
  ctx.body = {
    code: 0,
    comments
  }
}

exports.addComment = async (ctx) => {
  const body = ctx.request.body
  const from = new ObjectId(body.from)
  const course = body.course ? new ObjectId(body.course) : ''
  let comment, data
  
  if (body.id) {
    comment = await Comment.findById({_id: body.id})
    comment.reply.push({
      from: from,
      to: comment.from,
      content: body.content
    })
    data = await comment.save()
  } else {
    comment = new Comment({
      course,
      from,
      content: body.content,
      type: body.type
    })
    data = await comment.save()
  }
  const res = await Comment.findById({_id: data._id})
    .populate('course')
    .populate('from')
    .populate('reply.from')
    .exec()
  ctx.body = {
    code: 0,
    comment: res
  }
}
