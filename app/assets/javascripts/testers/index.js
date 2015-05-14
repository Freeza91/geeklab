$(function () {
  if(!$('body').hasClass('testers_index')) {
    return false;
  }
  $('.temp').on('click', function() {
    var $modal = $('#info-modal');
    $modal.find('.title').text('怎么成为体验师');
    $modal.find('.content').text('完成新手任务即可成为体验师');
    $modal.modal();
    //怎么体验产品
    //任务会以邮件的方式发送到你的邮箱里，请注意查收
  });
});
