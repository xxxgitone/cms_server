const router = require('koa-router')()
const wechatUser = require('../controllers/wechatUser')

router.get('/wechatuser', wechatUser.fetchWechatUserByToken)

module.exports = router
