const sha1 = require('sha1')
const getRawBody = require('raw-body')
// const Wechat = require('./wechat')
const util = require('./util')

module.exports = (opts) => {
  // const wechat = new Wechat(opts)
  return async (ctx, next) => {
    const token = opts.token
    const {
      signature, 
      timestamp, 
      nonce, 
      echostr
    } = ctx.request.query
    const str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)
    
    // 微信第一次通过get请求验证身份
    if (ctx.method === 'GET') {
      if (sha === signature) {
        ctx.body = echostr + ''
      } else {
        ctx.body = 'wrong'
      }
    } else if (ctx.method === 'POST') {
      if (sha !== signature) {
        ctx.body = 'wrong'
        return false
      }
      // 接受POST请求过来的数据XML格式
      const data = await getRawBody(ctx.req, {
        length: ctx.length,
        limit: '1mb',
        encoding: ctx.charset
      })

      const content = await util.parseXMLAsync(data)
      console.log(content)

      const message = util.formatMessage(content.xml)
      console.log(message)

      if (message.MsgType === 'event') {
        if (message.Event === 'subscribe') {
          const now = +new Date()
          ctx.status = 200
          ctx.type = 'application/xml'
          ctx.body = `
            <xml>
              <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
              <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
              <CreateTime>${now}</CreateTime>
              <MsgType><![CDATA[text]]></MsgType>
              <Content><![CDATA[欢迎订阅～]]></Content>
            </xml>
          `
          return
        }
      }
    }
  }
}