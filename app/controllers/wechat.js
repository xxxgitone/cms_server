const reply = require('../../wx/reply')
const wechat = require('../../wechat/verification')
const wx = require('../../wx/index')
const Course = require('../models/course')

exports.hear = async (ctx, next) => {
  ctx.middle = wechat(wx.wechatOptions.wechat, reply.reply)
  await ctx.middle(ctx, next)
}

exports.index = async (ctx, next) => {
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
