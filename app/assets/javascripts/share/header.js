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
  $('.role-switch').on('click', function () {
    var currRole = $(this).data('currRole');
    switch(currRole) {
      case 'pm':
        location.href = '/testers';
      break;
      case 'tester':
        location.href = '/pms';
      break;
    }
  });
});
