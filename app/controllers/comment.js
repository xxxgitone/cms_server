const Comment = require('../models/comment')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

exports.addComment = async (ctx) => {
  const body = ctx.request.body
  const course = new ObjectId(body.course)
  const from = new ObjectId(body.from)
  const comment = new Comment({
    course,
    from,
    content: body.content
  })
  console.log(comment)
}