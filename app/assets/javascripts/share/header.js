$(function () { 
  $(document).on('scroll', function (event) {
    var $this = $(this);
    var scrollTop = $this.scrollTop();
    if(scrollTop != 0) {
      $('.header').addClass('scroll-down');
    } else {
      $('.header').removeClass('scroll-down');
    } 
  });
});
