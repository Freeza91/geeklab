$(function () {
  $('.js-change-role').on('click', function () {
    var href = $(this).data('href');
    location.href = href;
  });

  function setMainMinHeight () {
    var height = document.documentElement.clientHeight - 50 - 160;
    $('main').css({
      'min-height': height + 'px'
    });
  }

  // 设置main的最小高度
  setMainMinHeight();
});
