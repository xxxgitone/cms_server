$(function() {
  var token = localStorage.getItem('wechat-token')
  var _id = localStorage.getItem('_id')
  var courseId = $('input[name="courseId"]').val()
  console.log(_id)
  console.log(courseId)
  var $tab_panels = $('.weui-tab__panel .tab-item')
  var $tabbar_item = $('.weui-navbar .weui-navbar__item')
  var lastIndex = 0
  $('.weui-navbar__item').on('tap', function() {
    var index = $(this).index()
    if (index !== lastIndex) {
      $($tabbar_item[lastIndex]).removeClass('weui-bar__item_on')
      $($tab_panels[lastIndex]).css('display', 'none')
      $(this).addClass('weui-bar__item_on')
      $($tab_panels[index]).css('display', 'block')
      lastIndex = index
    }
  })

  $('.submit-content').on('tap', function () {
    var content = $('input[name="content"]').val()
    var form = {
      token,
      course: courseId,
      from: _id,
      content,
    }
    $.post('/api/comment', form, function (data) {
      console.log(data)
    })
  })
})