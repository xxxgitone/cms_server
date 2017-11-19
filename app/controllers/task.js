const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const Task = require('../models/task')
const util = require('../../libs/util')

const addTask = async (ctx) => {
  const form = ctx.request.body
  const userId = new ObjectId(form.user)
  let task
  if (form.type === 'performance') {
    task = new Task({
      user: userId,
      status: form.status || 'pending',
      startDate: util.getCurrentMonthFirst(),
      endDate: util.getCurrentMonthLast(),
      createAt: Date.now(),
      performance: form.performance,
      content: '',
      type: form.type,
      campus: form.campus,
    })
  } else if (form.type === 'ordinary') {
    task = new Task({
      user: userId,
      status: form.status || 'pending',
      startDate: form.startDate,
      endDate: form.endDate,
      createAt: Date.now(),
      performance: form.performance,
      content: form.content,
      type: form.type,
      campus: form.campus,
    })
  }

  const data = await task.save()
  console.log(data)
  ctx.body = {
    code: 0,
    task: data
  }
}

module.exports = {
  addTask
}