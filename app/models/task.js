const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const TaskSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User'
  },
  // `pending -> progress -> fulfilled`
  status: {
    type: String,
    default: 'pending'
  },
  startDate: {
    type: Date,
    default: Date.now()
  },
  createAt: {
    type: Date,
    default: Date.now()
  },
  performance: Number,
  endDate: Date,
  // 任务类型：`performance(业绩)`和`ordinary(普通)`
  type: String,
  campus: String
})

const Task = mongoose.model('Task', TaskSchema)
module.exports = Task
