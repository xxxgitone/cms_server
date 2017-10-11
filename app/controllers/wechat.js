const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const config = require('../config/config')
const reply = require('../../wx/reply')
const wechat = require('../../wechat/verification')
const wx = require('../../wx/index')
const Course = require('../models/course')
const WechatUser = require('../models/wechatUser')
const jwt = require('jsonwebtoken')

exports.hear = async (ctx, next) => {
  ctx.middle = wechat(wx.wechatOptions.wechat, reply.reply)
  await ctx.middle(ctx, next)
}

exports.oauth = async (ctx, next) => {
  const redirect = 'http://935faf58.ngrok.io/index'
  const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${wx.wechatOptions.wechat.appID}&redirect_uri=${redirect}&response_type=code&scope=snsapi_userinfo#wechat_redirect`

  ctx.redirect(url)
}

exports.index = async (ctx, next) => {
  const {code} = ctx.query
  const openUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${wx.wechatOptions.wechat.appID}&secret=${wx.wechatOptions.wechat.appsecret}&code=${code}&grant_type=authorization_code`

  const response = await request({url: openUrl, json: true})
  const data = response.body

  const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${data.access_token}&openid=${data.openid}&lang=zh_CN`

  const response_next = await request({url, json: true})

  const data_next = response_next.body
  const openid = data_next.openid
  let user = await WechatUser.findOne({openid})
  if (!user) {
    user = await WechatUser.create(data_next)
  }

  const userToken = {
    id: user._id
  }

  const token = jwt.sign(userToken, config.tokenSecret)
  ctx.state.wechatuser = Object.assign(user, {token})
  console.log(ctx.state)

  await ctx.render('index', {
    title: '首页'
  })
}

exports.courseDetial = async (ctx, next) => {
  const {id} = ctx.params
  const courseInfo = await Course.findById({_id: id})

  await ctx.render('courseDetail', {
    courseInfo
  })
}

exports.orderDetail = async (ctx, next) => {
  const id = ctx.query.courseId
  const courseInfo = await Course.findById({_id: id})

  await ctx.render('orderDetail', {
    courseInfo
  })
}
