const router = require('koa-router')()
const task = require('../controllers/task')

router.get('/task', task.fetchTasks)
router.post('/task', task.addTask)

module.exports = router
