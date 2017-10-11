$(function () {
  $('.confirm-order-button').on('tap', function () {
    const courseId = $('#courseId').val()
    $.get('/api/course?_id=' + courseId, function (data) {
      if (data.code === 0) {
        const course = data.course
        const form = {
          campus: course.campus,
          course: course.courseName,
          price: course.price,
          number: 1,
          receivable: course.price,
          payment: '微信'
        }
        $.post('/api/orders', form, function (data) {
          console.log(data)
        })
      }
    })
  })

})