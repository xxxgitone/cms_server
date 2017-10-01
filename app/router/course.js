const router = require('koa-router')()
const course = require('../controllers/course')

router.get('/courses', course.fetchCourse)

router.get('/course', course.fetchCourseById)

router.post('/courses', course.addCourse)

router.put('/courses', course.updateCourse)

router.delete('/courses', course.deleteCourse)

module.exports = router
