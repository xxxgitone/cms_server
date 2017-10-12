$(function() {
  var $tab_panels = $('.weui-tab__panel .tab-item')
  var $tabbar_item = $('.weui-tabbar a')
  var lastIndex = 0
  $('a').on('tap', function() {
    var index = $(this).index()
    if (index !== lastIndex) {
      $($tabbar_item[lastIndex]).removeClass('weui-bar__item_on')
      $($tab_panels[lastIndex]).css('display', 'none')
      $(this).addClass('weui-bar__item_on')
      $($tab_panels[index]).css('display', 'block')
      lastIndex = index
    }
  })

  var token = localStorage.getItem('wechat-token')
  $.get('/api/courses?token=' + token, function (data) {
    var course = data.course
    console.log(course)
    var html = course.map(function (item) {
      return `
        <a href="course/${item._id}" class="weui-media-box weui-media-box_appmsg">
          <div class="weui-media-box__hd">
            <img class="weui-media-box__thumb" src="http://dummyimage.com/200x200/f2d479/b179f2&text=C" alt="">
          </div>
          <div class="weui-media-box__bd">
            <h4 class="weui-media-box__title">${item.courseName}</h4>
            <p class="weui-media-box__desc">${item.introduction}</p>
          </div>
        </a>
      `
    }).join('')
    $('.weui-panel__bd').html(html)
  })

  $.get('/api/wechatuser?token=' + token, function (data) {
    const user = data.user
    console.log(user)
    $('.nickname').html(user.nickname)
  })
})