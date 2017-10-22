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
  const course = new ObjectId(body.course)
  const from = new ObjectId(body.from)
  const comment = new Comment({
    course,
    from,
    content: body.content,
    type: body.type
  })
  const data = await comment.save()
  const res = await Comment.findById({_id: data._id}).populate('course').populate('from')
  console.log(res)
  ctx.body = {
    code: 0,
    comment: res
  }
}
