$(function () {
  if(!$('body').hasClass('testers_index')) {
    return false;
  }
  var verticalCentered,
      rotateInterval;
  var windowWidth = document.documentElement.clientWidth;
  if(windowWidth <= 992) {
    verticalCentered = false;
  } else {
    verticalCentered = true;
  }
  $('#fullpage').fullpage({
    //Scrolling
    css3                              : true,
    scrollingSpeed                    : 1000,
    autoScrolling                     : true,
    fitToSection                      : true,
    fitToSectionDelay                 : 500,
    scrollBar                         : false,
    easing                            : 'easeInOutCubic',
    easingcss3                        : 'ease',
    continuousVertical                : false,
    normalScrollElements              : '#element1, .element2',
    scrollOverflow                    : false,
    touchSensitivity                  : 15,
    normalScrollElementTouchThreshold : 5,

    //Accessibility
    keyboardScrolling                 : true,
    animateAnchor                     : true,
    recordHistory                     : false,

    //Design
    controlArrows                     : true,
    verticalCentered                  : true,
    resize                            : true,
    paddingTop                        : '50px',
    paddingBottom                     : '0',
    sectionsColor                     : ['#fff', '#fbf9f3'],
    //fixedElements                     : '#header, .footer',
    responsiveWidth                   : 0,
    responsiveHeight                  : 0,

    //Custom selectors
    sectionSelector                   : '.section',
    slideSelector                     : '.slide',

    //events
    afterRender    : function () {
      var windowWidth = document.documentElement.clientWidth;
      if(windowWidth <= 992) {
        $('.video-info').unwrap();
        $('.step-list').unwrap();
      }
    },

    afterLoad      : function(anchorLink, index){
      switch(index) {
        case 1:
          $('#header').removeClass('zoom-out');
          sloganRotate();
          changeButtonPosition('bottom');
        break;
        case 2:
          $('#header').addClass('zoom-out');
          changeButtonPosition('bottom');
        break;
        case 3:
          changeButtonPosition('top');
          clearInterval(rotateInterval);
        break;
      }
    },
    afterResize    : function() {
      var height = document.documentElement.clientHeight - 50;
      var $player = $('.player');
      $player.find('object').height(height);
      $player.find('embed').height(height);
    }
  });

  $('#js-change-role').on('click', function () {
    var href = $(this).data('href');
    location.href = href;
  });

  $('#video-start').on('click', function () {
    var height = document.documentElement.clientHeight - 50;
    console.log(height);
    var $player = $('.player');
    $player.find('object').height(height);
    $player.find('embed').height(height);
    $(this).css('display', 'none');
    $('.video-info').css('display', 'none');
    $('#footer').css('display', 'none');
    $('#section3 .mask').remove();
    $player.css({
      'display': 'block'
    });
    $.fn.fullpage.reBuild();
  });

  function changeButtonPosition(type) {
    if(type === 'top') {
      $('#change-role').removeClass('bottom').addClass('top');
      $('#login').removeClass('bottom').addClass('top');
    }
    if(type === 'bottom') {
      $('#change-role').removeClass('top').addClass('bottom');
      $('#login').removeClass('top').addClass('bottom');
    }
  }

  function sloganRotate () {
    var item = $('#slogan .dynamic b'),
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

});
