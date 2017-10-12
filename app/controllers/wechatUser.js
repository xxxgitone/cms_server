const WechatUser = require('../models/wechatUser')

const fetchWechatUserByToken = async (ctx, next) => {
  const {id} = ctx.decoded
  const user = await WechatUser.findById(id)
  ctx.body = {
    code: 0,
    user
  }
}

module.exports = {
  fetchWechatUserByToken
}