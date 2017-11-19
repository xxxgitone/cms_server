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
  ctx.body = {
    code: 0,
    task: data
  }
}

const fetchTasks = async (ctx) => {
  const query = ctx.request.query
  const data = await Task.find(query).sort({createAt: -1}).populate('user')
  ctx.body = {
    code: 0,
    tasks: data
  }
}

module.exports = {
  addTask,
  fetchTasks
}