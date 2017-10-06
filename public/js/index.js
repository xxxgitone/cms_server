$(function() {
  var $tab_panels = $('.weui-tab__panel div')
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
})