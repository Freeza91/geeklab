$(function () {
  if(!$('body').hasClass('testers_index')) {
    return false;
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
    sectionsColor                     : ['#fff', '#fbf9f3', '#fff'],
    //fixedElements                     : '#header, .footer',
    responsiveWidth                   : 0,
    responsiveHeight                  : 0,

    //Custom selectors
    sectionSelector                   : '.section',
    slideSelector                     : '.slide',

    //events
    onLeave        : function(index, nextIndex, direction){},
    afterLoad      : function(anchorLink, index){
      if(index === 1) {
        $('#header').removeClass('zoom-out');
      } else {
        $('#header').addClass('zoom-out');
      }
    },
    afterRender    : function(){},
    afterResize    : function(){},
    afterSlideLoad : function(anchorLink, index, slideAnchor, slideIndex){},
    onSlideLeave   : function(anchorLink, index, slideIndex, direction, nextSlideIndex){}
  });

});
