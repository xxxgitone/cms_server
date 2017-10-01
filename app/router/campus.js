const router = require('koa-router')()
const campus = require('../controllers/campus')

router.get('/campus', campus.fetchCampus)

router.post('/campus', campus.addCampus)

router.put('/campus', campus.updateCampus)

router.delete('/campus', campus.deleteCampus)

module.exports = router
