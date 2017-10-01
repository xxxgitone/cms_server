const router = require('koa-router')()
const user = require('../controllers/user')

router.get('/users', user.fetchUsers)
router.get('/user', user.fetchUserByToken)
router.post('/users', user.loginOrAddUser)
router.put('/users', user.updateUser)
router.delete('/users', user.deleteUser)

module.exports = router
