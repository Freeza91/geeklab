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
    console.log(player.volume);
    //player.volume += 0.1;
  });
  $('#turndown').on('click', function () {
    console.log(player.volume);
    //player.volume -= 0.1;
  });
  $('#set-currenttime').on('click', function () {
    player.currentTime = $('#currenttime').val();
  })

});
