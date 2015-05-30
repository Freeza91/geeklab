$(function () {
  if(!$('body').hasClass('testers_index')) {
    return false;
  }
  $('.temp').on('click', function() {
    var $this = $(this);
    var approved = $this.data('approved');
    var $modal = $('#info-modal');
    if(approved) {
      $modal.find('.title').text('怎么体验产品');
      $modal.find('.content').text('任务会以邮件的方式发送到你的邮箱里，请注意查收');
      $modal.modal();
    } else {
      $.ajax({
        url: '/users/mailers/send_novice_task'
      })
      .done(function (data, status) {
        if(data.status === 0 && data.code === 1) {
          $modal.find('.title').text('怎么成为体验师');
          $modal.find('.content').text('完成新手任务即可成为体验师，新手任务已经在你的邮箱里了，赶快去完成吧!');
          $modal.modal();
        }
      })
      .error(function (errors, status) {
        console.log(errors);
      });
    }
  });
});
