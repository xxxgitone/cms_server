const router = require('koa-router')()
const jwt = require('../middlewares/jwtMiddle')
const userRoutes = require('./user')
const teacherRoutes = require('./teacher')
const campusRoutes = require('./campus')
const courseRoutes = require('./course')
const studentRoutes = require('./student')
const orderRoutes = require('./order')
const game = require('../controllers/game')
const wechat = require('../controllers/wechat')

router.get('/movie', game.movie)
router.get('/wx', wechat.hear)
router.post('/wx', wechat.hear)

router.use('/api', jwt(), userRoutes.routes())
router.use('/api', jwt(), teacherRoutes.routes())
router.use('/api', jwt(), campusRoutes.routes())
router.use('/api', jwt(), courseRoutes.routes())
router.use('/api', jwt(), studentRoutes.routes())
router.use('/api', jwt(), orderRoutes.routes())

module.exports = router
