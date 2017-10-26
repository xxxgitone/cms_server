$(function() {
  var token = localStorage.getItem('wechat-token')
  var $tab_panels = $('.weui-tab__panel .tab-item')
  var $tabbar_item = $('.weui-tabbar a')
  var lastIndex = 0
  $('.weui-tabbar a').on('tap', function() {
    var index = $(this).index()
    var link = $(this).data('link')
    if (index !== lastIndex) {
      $($tabbar_item[lastIndex]).removeClass('weui-bar__item_on')
      $($tab_panels[lastIndex]).css('display', 'none')
      $(this).addClass('weui-bar__item_on')
      $($tab_panels[index]).css('display', 'block')
      lastIndex = index
    }

    if (link === 'formal' || link === 'audition') {
      var url = '/api/courses?token=' + token + '&courseType=' + link
      getData(url, link) 
    }
  })

  getData('/api/courses?token=' + token + '&courseType=formal', 'formal')

  function getData (url, el) {
    $.get(url, function (data) {
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
      $('.weui-panel__bd.' + el).html(html)
    })
  }
  
  $.get('/api/wechatuser?token=' + token, function (data) {
    const user = data.user
    localStorage.setItem('_id', user._id)
    console.log(user)
    $('.nickname').html(user.nickname)
  })
  
  $('.my-link').on('tap', function (e) {
    e.preventDefault()
    var href = $(this).data('href')
    var fromOpenid = localStorage.getItem('openid')
    window.location.href = '/' + href + '?fromOpenid=' + fromOpenid
  })

})
