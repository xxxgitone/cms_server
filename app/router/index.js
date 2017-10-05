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
const index = require('../controllers/index')

// cms server & wechat
router.get('/movie', game.movie)
router.get('/index', index.index)
router.get('/wx', wechat.hear)
router.post('/wx', wechat.hear)

// cms api
router.use('/api', jwt(), userRoutes.routes())
router.use('/api', jwt(), teacherRoutes.routes())
router.use('/api', jwt(), campusRoutes.routes())
router.use('/api', jwt(), courseRoutes.routes())
router.use('/api', jwt(), studentRoutes.routes())
router.use('/api', jwt(), orderRoutes.routes())

module.exports = router
