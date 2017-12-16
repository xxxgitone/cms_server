$(function() {
  var token = localStorage.getItem('wechat-token')
  var link = 'formal'
  var $tab_panels = $('.weui-tab__panel .tab-item')
  var $tabbar_item = $('.weui-tabbar a')
  var lastIndex = 0
  var lastTagIndex = 0
  $('.weui-tabbar a').on('tap', function() {
    var index = $(this).index()
    link = $(this).data('link')
    localStorage.setItem('link', link)
    lastTagIndex = 0
    if (index !== lastIndex) {
      $($tabbar_item[lastIndex]).removeClass('weui-bar__item_on')
      $($tab_panels[lastIndex]).css('display', 'none')
      $(this).addClass('weui-bar__item_on')
      $($tab_panels[index]).css('display', 'block')
      lastIndex = index
    }

    $('.tags-list.' + link).on('tap', 'li', getCourseByTag)

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
        var price = Number(item.price) === 0 
          ? `<span>试听</span>` 
          : ` <span>￥${item.price}</span>
              <span style="display: inline-block;width: 80%;text-align: right;">正式</span>` 
        return `
          <a href="course/${item._id}" class="weui-media-box weui-media-box_appmsg">
            <div class="weui-media-box__hd">
              <img class="weui-media-box__thumb" src="${item.picUrl}">
            </div>
            <div class="weui-media-box__bd">
              <h4 class="weui-media-box__title" style="display:flex;justify-content:space-between;">
                ${item.courseName}
                <span style="font-size: 14px; color: #666;margin-right: 6px;">
                  ${item.campus}
                </span>
              </h4>
              <p class="weui-media-box__desc">${item.introduction}</p>
              <span style="color: red; font-size: 12px;">
               ${price}
              </span>
            </div>
          </a>
        `
      }).join('')
      $('.weui-panel__bd.' + el).html(html)
    })
  }

  function getCourseByTag () {
    var index = $(this).index()
    var tag
    if (index !== lastTagIndex) {
      $(this).addClass('active')
      $('.tags-list.' + link + ' li').eq(lastTagIndex).removeClass('active')
      tag = $(this).text()
      if (tag === '全部') {
        tag = ''
      }
      lastTagIndex = index
      var url = '/api/courses?token=' + token + '&courseType=' + link + '&tag=' + tag
      getData(url, link)
    }
  }

  $('.tags-list.' + link).on('tap', 'li', getCourseByTag)
  
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
