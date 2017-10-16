$(function () {
  var token = localStorage.getItem('wechat-token')
  $('.confirm-order-button').on('tap', function () {
    const courseId = $('#courseId').val()
    const form = {
      token,
      courseId,
      number: 1,
      payment: '微信',
      studentName: $('#studentName').val(),
      phoneNumber: $('#phoneNumber').val(),
      birthday: $('#birthday').val(),
      parentName: $('#parentName').val(),
      gender: $("input[name='gender']:checked").val()
    }
    console.log(form)
    $.post('/api/orders', form, function (data) {
      if (data.code === 0) {
        window.location.href = '/success'
      }
    })
  })
})