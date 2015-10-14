$(function () {
  if(!$('body').hasClass('testers_rating_help')) {
    return false;
  }

  function calcRatingItemWidth (ratingItemCount) {
    var count = ratingItemCount,
        windowWidth = document.documentElement.clientWidth;

    var extraWidth = windowWidth % count,
        width = Math.floor(windowWidth / count);
    var calcWidth = 0,
        widthSum = 0;

    for(var i = 0; i < count; i++) {
      var selector = '.rating-help-item:eq(' + i + ')';
      calcWidth = i < extraWidth ? (width + 1) : width;
      $(selector).css({
        width: calcWidth,
        left: widthSum
      });
      widthSum += calcWidth;
    }
  }

  function expandRatingItem (ratingItemIndex) {
    //calcRatingItemWidth(6);
    var $ratingItems = $('.rating-help-item'),
        widthSum = 0;
    $ratingItems.each(function (index, item) {
      var $item = $(item),
          newWidth = width = $item.width();
      if(index === ratingItemIndex) {
        newWidth += 150;
      } else {
        newWidth -= 30;
      }
      $item.animate({
        width: newWidth,
        left: widthSum
      }, 500);
      widthSum += newWidth;
    });
  }

  $(window).on('resize', function () {
    calcRatingItemWidth(6);
  });

  $('.rating-help-item').on('mouseenter', function () {
    expandRatingItem($(this).index());
  });

  $('.rating-help-item').on('mouseleave', function () {
    calcRatingItemWidth(6);
  });

  calcRatingItemWidth(6);
});
