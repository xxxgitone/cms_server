const router = require('koa-router')()
const renew = require('../controllers/renew')

router.post('/renew', renew.addAfterPayment)

module.exports = router
