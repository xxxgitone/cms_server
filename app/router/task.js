const router = require('koa-router')()
const task = require('../controllers/task')

router.get('/task', task.fetchTasks)

router.post('/task', task.addTask)

router.put('/task', task.updateTask)

module.exports = router
