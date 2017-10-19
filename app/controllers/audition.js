const Audition = require('../models/audition')
const mongoose = require('mongoose')

exports.addAudition = async (ctx) => {
  const form = ctx.request.body
  const courseId = new mongoose.Types.ObjectId(form.courseId)
  const auditionInfo = {
    course: courseId,
    studentName: form.studentName,
    phoneNumber: form.phoneNumber,
    birthday: form.birthday,
    parentName: form.parentName,
    gender: form.gender
  }
  const audition = await Audition.create(auditionInfo)
  ctx.body = {
    code: 0,
    audition
  }
}
