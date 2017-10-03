const reply = require('../../wx/reply')
const wechat = require('../../wechat/verification')
const wx = require('../../wx/index')

exports.hear = async (ctx, next) => {
  ctx.middle = wechat(wx.wechatOptions.wechat, reply.reply)
  await ctx.middle(ctx, next)
}
