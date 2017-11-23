const jwt = require('jsonwebtoken')
const config = require('../config/config')

module.exports = function () {
  return async (ctx, next) => {
    const {action} = ctx.request.body
    if (action === 'login') {
      await next()
    } else {
      const token = ctx.request.headers['cms-token'] || ctx.request.query.token || ctx.request.body.token
      if (token) {
        const decoded = jwt.verify(token, config.tokenSecret)
        if (decoded && decoded.id) {
          ctx.decoded = decoded
          await next()
        } else {
          console.log('token验证失败')
          ctx.body = {
            code: -1,
            msg: 'token验证失败'
          }
        }
      } else {
        console.log('No token provide')
        ctx.body = {
          code: -1,
          msg: 'No token provided'
        }
      }
    }
  }
}
