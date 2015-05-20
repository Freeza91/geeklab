$(function () {
  if(!$('body').hasClass('assignments_index')) {
    return false;
  }

  $('.video-upload').on('click', function () {
    var $form = $(this).parent('.modal').find('form'); 
    // 获取文件
    // var file =
    getUploadToken(userId, assignmentId, function (token) {
      if(token) {
        uploadVideo(file, token, function (msg) {
          console.log(msg);
        });
      }
    });
  });
  function uploadVideo(file, token, callback) {
    // ajax上传
    $.ajax({
      url: 'upload.qiniu.com',
      method: 'post',
      data: {
        token: token,
        file: file,
        accept: 'application/json'
      }
    })
    .done(function(data, status) {
      if(data.status === 0) {
        switch(data.code) {
          case 0:
            alert('上传失败');
            break;
          case 1:
            var msg = data.msg;
            callback(msg);
            break;

        }
      }
    })
    .error(function(errors, status) {
      console.log(errors);
    });
  }

  function getUploadToken(userId, assignmentId, callback) {
    var url = '/testers/' + userId + '/assignments/' + assignmentId +'/upload_token/';
    $.ajax({
      url: url,
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        // 成功获取token, 执行回调上传图片
        var token = data.token;
        callback(token);
      } else {
        alert('获取token失败');
      }
    })
    .error(function(errors, status) {
      console.log(errors);
    })
  }
 
});
