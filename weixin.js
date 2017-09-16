const config = require('./config')
const Wechat = require('./wechat/wechat')
const wechatApi = new Wechat(config.wechat)

/**
 * 根据用户的请求信息，返回相应的内容
 */
exports.reply = async (ctx, next) => {
  const message = ctx.weixin
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      if (message.EventKey) {
        console.log('扫毛二维码: ' + message.EventKey + ' ' + message.Ticket)
      }
      ctx.body = '欢迎订阅～'
    } else if (message.Event === 'unsubscribe') {
      ctx.body= ''
      console.log('取消关注')
    } else if (message.Event === 'LOCATION') {
      ctx.bdy = `您上报的位置是: ${message.Latitude}/${message.Longitude}-${message.Precision}`
    } else if (message.Event === 'CLICK') {
      ctx.body = `您点击了菜单: ${message.EventKey}`
    } else if (message.Event === 'SCAN') {
      console.log(`关注后扫二维码${message.EventKey} ${message.Ticket}`)
      ctx.body = '看到你扫了一下哦'
    } else if (message.Event === 'VIEW') {
      ctx.body = `您点击的链接: ${message.EventKey}`
    }
  } else if (message.MsgType === 'text'){
    const content = message.Content
    let reply = `您的话是: ${message.Content}`

    if (content === '1') {
      reply = '1'
    } else if (content === '2') {
      reply = '2'
    } else if (content === '3') {
      reply = '3'
    } else if (content === '4') {
      reply = [{
        Title: 'github',
        Description: '最大的同性交友网站',
        PicUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1505490329240&di=92852ad01eb3da50aa52aa3cb2de7d7c&imgtype=0&src=http%3A%2F%2Fwww.embeddedlinux.org.cn%2Fuploads%2Fallimg%2F151115%2F0934120.jpg',
        Url: 'https://github.com/xxxgitone'
      }]
    } else if (content === '5') {
      const data = await wechatApi.uploadMaterial('image', __dirname + '/2.jpg')
      reply = {
        type: 'image',
        Media_id: data.media_id
      }
    }

    ctx.body = reply
  }
  await next()
}