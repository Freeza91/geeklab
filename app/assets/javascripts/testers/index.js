$(function () {
  if(!$('body').hasClass('testers_index')) {
    return false;
  }
  var rotateInterval;
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
    afterLoad      : function(anchorLink, index){
      if(index === 1) {
        $('#header').removeClass('zoom-out');
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
      } else {
        $('#header').addClass('zoom-out');
        clearInterval(rotateInterval);
      }
    }
  });

  $('#js-change-role').on('click', function () {
    var href = $(this).data('href');
    location.href = href;
  });

});
