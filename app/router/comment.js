const router = require('koa-router')()
const comment = require('../controllers/comment')

router.get('/comments', comment.fetchComments)

router.put('/comments', comment.updateIsRead)

router.post('/comments', comment.addComment)

module.exports = router
