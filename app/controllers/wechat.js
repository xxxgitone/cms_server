const Promise = require('bluebird')
const request = Promise.promisify(require('request'))
const config = require('../config/config')
const reply = require('../../wx/reply')
const wechat = require('../../wechat/verification')
const wx = require('../../wx/index')
const Course = require('../models/course')
const WechatUser = require('../models/wechatUser')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const util = require('../../libs/util')

exports.hear = async (ctx, next) => {
  ctx.middle = wechat(wx.wechatOptions.wechat, reply.reply)
  await ctx.middle(ctx, next)
}

exports.oauth = async (ctx, next) => {
  const redirect = 'http://9ffc936b.ngrok.io/index'
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
  if (openid) {
    let user = await WechatUser.findOne({openid})
    if (!user) {
      user = await WechatUser.create(data_next)
    }
  
    const userToken = {
      id: user._id
    }
  
    const token = jwt.sign(userToken, config.tokenSecret)
    ctx.state.token = token
    ctx.state.openid = openid
  } else {
    ctx.state.token = ''
    ctx.state.openid = ''
  }

  await ctx.render('index', {
    title: '首页'
  })
}

exports.courseDetial = async (ctx, next) => {
  const {id} = ctx.params
  const courseInfo = await Course.findById({_id: id})
  const commentsAdv = await Comment.fetchCommentsByCourseId(id, 'advisory')
  const commentsFeedback = await Comment.fetchCommentsByCourseId(id, 'feedback')
  commentsAdv.forEach((item) => {
    item.create = util.timeAgo(item.createAt)
  })
  commentsFeedback.forEach((item) => {
    item.create = util.timeAgo(item.createAt)
  })

  await ctx.render('courseDetail', {
    courseInfo,
    commentsAdv,
    commentsFeedback
  })
}

exports.orderDetail = async (ctx, next) => {
  const id = ctx.query.courseId
  const courseInfo = await Course.findById({_id: id})

  await ctx.render('orderDetail', {
    courseInfo
  })
}

exports.success = async(ctx, next) => {
  await ctx.render('success')
}
