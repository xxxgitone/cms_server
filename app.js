const Koa = require('koa')
const sha1 = require('sha1')
const app = new Koa()
const weixin = require('./weixin')
const wechat = require('./wechat/verification')
const config = require('./config')

app.use(wechat(config.wechat, weixin.reply))

app.listen(3100)
console.log('Listening: 3100')