$(function () {
  if(!$('body').hasClass('pages_home')) {
    return;
  }
  $('.banner .role').on('click', function () {
    var $this = $(this);
    var $root = $this.parent();
    if($this.hasClass('left')) {
      $root.children('.right').addClass('hidden');
      $('.banner').addClass('show-left');
    } else {
      $root.children('.left').addClass('hidden');
      $('.banner').addClass('show-right');
    }
    $this.addClass('active');
  });
});
