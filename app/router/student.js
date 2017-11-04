const router = require('koa-router')()
const student = require('../controllers/student')

router.get('/students', student.fetchStudents)

router.get('/studentsByCourseId', student.fetchStudentsByCourseId)

router.delete('/students', student.deleteStudent)

module.exports = router
