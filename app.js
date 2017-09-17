const Koa = require('koa')
const sha1 = require('sha1')
const app = new Koa()
const reply = require('./wx/reply')
const wechat = require('./wechat/verification')
const config = require('./config')

app.use(wechat(config.wechat, reply.reply))

app.listen(3100)
console.log('Listening: 3100')