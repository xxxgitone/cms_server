const router = require('koa-router')()
const teacher = require('../controllers/teacher')

router.get('/teachers', teacher.fetchTeachers)

router.get('/teacher', teacher.fetchTeacherById)

router.post('/teachers', teacher.addTeacher)

router.put('/teachers', teacher.updateTeacher)

router.delete('/teachers', teacher.deleteTeacher)

module.exports = router
