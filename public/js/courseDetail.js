$(function() {
  var token = localStorage.getItem('wechat-token')
  var _id = localStorage.getItem('_id')
  var courseId = $('input[name="courseId"]').val()
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
    var content = $('.weui-textarea.advisory').val()
    if (!content) return
    var form = {
      token,
      course: courseId,
      from: _id,
      content,
      type: 'advisory'
    }
    request(form, 'advisory')
  })

  $('.submit-feedback').on('tap', function (data) {
    var content = $('.weui-textarea.feedback').val()
    if (!content) return
    var form = {
      token,
      course: courseId,
      from: _id,
      content,
      type: 'feedback'
    }
    request(form, 'feedback')
  })

  function request(form, type) {
    $.post('/api/comments', form, function (data) {
      if (data.code === 0) {
        $('.weui-textarea.' + type).val('')
        $('#toast').css('display', 'block')
        $('.weui-toast__content').html('成功')
        var comment = data.comment
        var create = timeAgo(comment.createAt)
        var html = 
          '<div class="comment-item"><div class="comment-auth-avatar"><img src="' + comment.from.headimgurl + '"/></div><div class="comment-content-info"><span class="comment-nickname">' + comment.from.nickname + '</span><span class="comment-content">' + comment.content + '</span><span class="comment-timeago">' + create + '</span></div></div>'
        $('.comment-list-wrapper.' + type).prepend(html)
        setTimeout(function () {
          $('#toast').css('display', 'none')
        }, 1000)
      }
    })
  }
})