const Koa = require('koa')
const json = require('koa-json')
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
// const config = require('./app/config/config')
const router = require('koa-router')()
// const mongoose = require('mongoose')
// const userRoutes = require('./app/router/user')
// const teacherRoutes = require('./app/router/teacher')
// const campusRoutes = require('./app/router/campus')
// const courseRoutes = require('./app/router/course')
// const studentRoutes = require('./app/router/student')
// const orderRoutes = require('./app/router/order')
// const axios = require('axios')
// const Order = require('./server/models/order')

const PORT = process.env.PORT || '3100'
const ENV = process.env.NODE_ENV || 'development'

// if (ENV === 'development') {
//   mongoose.connect(config.mongo.dev.connectionUrl)
// }
// mongoose.Promise = global.Promise

const app = new Koa()

app.use(logger())
app.use(bodyParser())
app.use(json())

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log('%s %s - %s', ctx.method, ctx.url, ms)
})

app.on('error', (err, ctx) => {
  console.log('server error', err)
})

const menu = require('./wx/menu')
const wx = require('./wx/index')
const wechatApi = wx.getWechat()


wechatApi.deleteMenu().then(() => {
  return wechatApi.createMenu(menu)
}).then((msg) => {
  console.log(msg)
})

const game = require('./app/controllers/game')
const wechat = require('./app/controllers/wechat')

router.get('/movie', game.movie)
router.get('/wx', wechat.hear)
router.post('/wx', wechat.hear)


// app.use(require('./app/middlewares/jwtMiddle'))
// router.use('/api', userRoutes.routes())
// router.use('/api', teacherRoutes.routes())
// router.use('/api', campusRoutes.routes())
// router.use('/api', courseRoutes.routes())
// router.use('/api', studentRoutes.routes())
// router.use('/api', orderRoutes.routes())

// axios.get('https://www.easy-mock.com/mock/59c35a9fe0dc663341b2ec0c/api/order').then((res) => {
//   res.data.data.forEach(item => {
//     Order.create(item)
//   })
// })

app
.use(router.routes())
.use(router.allowedMethods())


module.exports = app.listen(PORT, function (err) {
if (err) {
  console.log(err)
  return
}
console.log('Listening at http://localhost:' + PORT)
})