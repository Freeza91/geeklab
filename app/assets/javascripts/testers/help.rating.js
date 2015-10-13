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

  $(window).on('resize', function () {
    calcRatingItemWidth(6);
  });

  calcRatingItemWidth(6);
});
