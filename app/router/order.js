const router = require('koa-router')()
const order = require('../controllers/order')

router.get('/orders', order.fetchOrders)

module.exports = router
