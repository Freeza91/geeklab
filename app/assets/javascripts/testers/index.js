$(function () {
  if(!$('body').hasClass('testers_index')) {
    return false;
  }

  $('#video-start').on('click', function () {
    $('[id^="cc_video"]').css({
      display: 'block'
    });
    $(this).css({
      display: 'none'
    });
  });

  function sloganRotate () {
    var item = $('.slogan .dynamic b'),
        index = 0;
    rotateInterval = setInterval(function () {
      var curInnerItem = $(item[index]).find('i'),
          nextInnerItem = $(item[(index + 1) % 2]).find('i'),
          curLen = curInnerItem.length,
          nextLen = nextInnerItem.length,
          lenMax = Math.max(curLen, nextLen),
          innerIndex = 0;
      var innerIntervalId = setInterval(function () {
        if(innerIndex < curLen) {
          curInnerItem[innerIndex].className = 'out';
        }
        if(innerIndex < nextLen) {
          nextInnerItem[innerIndex].className = 'in';
        }
        innerIndex += 1;
        if(innerIndex >= lenMax) {
          clearInterval(innerIntervalId);
        }
      }, 100);
      index = (index + 1) % 2;
    }, 2000);
  }
  sloganRotate();

  function setTrangleBorderWidth () {
    var width = parseInt(document.documentElement.clientWidth / 2);
    width = window.innerWidth > 1440 ? 600: width;
    $('.triangle-down').css({
      'border-left-width': width,
      'border-right-width': width,
    });
  }
  setTrangleBorderWidth();

  // 首屏箭头
  $('.icon-arrow-down').on('click', function () {
    $('html, body').animate({
      scrollTop: 760
    }, 800);
  });

});
