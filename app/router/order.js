const router = require('koa-router')()
const order = require('../controllers/order')

router.get('/orders', order.fetchOrders)

router.get('/order/count', order.fetchOrdersCountByDate)

router.get('/order/curMonth', order.fetchTotalSalesByCurrentMonth)

router.get('/order/week', order.fetchTotalSalesByWeek)

router.get('/order/totalSales', order.fetchTotalSalesByDate)

router.post('/orders', order.addOrder)

module.exports = router
