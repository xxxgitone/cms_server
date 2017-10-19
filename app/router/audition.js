const router = require('koa-router')()
const audition = require('../controllers/audition')

router.post('/audition', audition.addAudition)

module.exports = router
