const router = require('koa-router')()
const task = require('../controllers/task')

router.post('/task', task.addTask)

module.exports = router
