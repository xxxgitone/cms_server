const router = require('koa-router')()
const order = require('../controllers/order')

router.get('/orders', order.fetchOrders)

router.post('/orders', order.addOrder)

module.exports = router
