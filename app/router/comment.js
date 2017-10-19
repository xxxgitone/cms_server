const router = require('koa-router')()
const comment = require('../controllers/comment')

router.post('/comment', comment.addComment)

module.exports = router
