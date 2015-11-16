$(function () {
  if(!$('body').hasClass('projects_video')) {
    return false;
  }

  var player = $('#video')[0];

  $('#play').on('click', function () {
    player.play();
    // 视频起止
    console.log(player.seekable.start(0), player.seekable.end(0));
    // 视频已经播放的时间
    console.log(player.played.end(0));
  });
  $('#pause').on('click', function () {
    player.pause();
  });
  $('#turnup').on('click', function () {
    player.volume += 0.1;
    console.log(player.volume);
  });
  $('#turndown').on('click', function () {
    player.volume -= 0.1;
    console.log(player.volume);
  });
  $('#set-currenttime').on('click', function () {
    player.currentTime = $('#currenttime').val();
  });

  $('.timepoint').on('click', function () {
    var timepoint = $(this).data('timepoint');
    player.currentTime = timepoint;
  });

  //$('.comment-content').on('click', function (event) {
    //var target = event.target;
    //$(this).attr('contentEditable', true);
  //});

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
