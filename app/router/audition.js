const router = require('koa-router')()
const audition = require('../controllers/audition')

router.get('/audition', audition.fetchAudition)

router.get('/audition/count', audition.fetchAuditonsCountByDate)

router.get('/auditionsByCourseId', audition.fetchAuditionsByCourseId)

router.post('/audition', audition.addAudition)

module.exports = router
