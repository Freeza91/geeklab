$(function () {
  if(!$('body').hasClass('projects_video')) {
    return false;
  }

  var player = $('#video')[0];

  //$('.comment-content').on('click', function (event) {
    //var target = event.target;
    //$(this).attr('contentEditable', true);
  //});

  $('.rating-star').on('click', function () {
    var rating = 5 - $(this).data('rating');
    console.log(rating);
  });

  function toggleItemBodyContent (event) {
    var $target = $(event.target),
        selector = $target.data('target');
    $target.parents('ul').find('a.active').removeClass('active');
    $target.addClass('active');
    $('.video-info-section.active').hide().removeClass('active');
    $(selector).fadeIn().addClass('active');
  }
  $('[role="tablist"] a').on('click', toggleItemBodyContent);

});
