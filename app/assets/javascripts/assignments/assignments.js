$(function () {
  if(!$('body').hasClass('assignments_index')) {
    return false;
  }

  // 上传视频按钮的click事件处理函数
  // 获取token
  // 上传视频
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

  // 删除任务按钮的click事件处理函数
  $('.assignment-del').on('click', function () {
    var options = {
      title: '对任务不感兴趣?',
      content: '任务删除后将无法查看和恢复，确认删除任务?',
      eventName: 'deleteAssigment'
    };
    showInfoModal(options);
  });
  // 删除视频 click event
  $('.video-del').on('click', function () {
    var options = {
      title: '确认删除视频?',
      eventName: 'deleteVideo'
    };
    showInfoModal(options);
  });
  // 重新上传 click event
  $('.video-reload').on('click', function () {
    var options = {
      title: '确认覆盖上传?',
      eventName: 'reloadVideo'
    };
    showInfoModal(options);
  });

  // 上传视频
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

  // 获取上传视屏的token
  function getUploadToken(userId, assignmentId, callback) {
    var url = '/testers/' + userId + '/assignments/' + assignmentId +'/upload_token/';
    $.ajax({
      url: url
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

  // 关闭任务卡片
  function closeCard () {
    var $this = $(this);
    var $card = $this.parents('.card');
    var assignment = $card.data('assignment');
    deleteAssigment (assignment.testerId, assignment.id, function () {
      // 在页面上移除任务card
      $card.remove();
    });
  }
 
  // 显示删除任务的提示信息
  /* @param options  Object 显示的提示信息
   * options.title  String 标题
   * options.content String 内容
   * options.eventName String 确认按钮将会触发的事件
   */
  function showInfoModal (options) {
    var $modal = $('#info-modal');
    $modal.data('eventName', options.eventName);
    $modal.find('.modal-body .title').text(options.title);
    $modal.find('.modal-body .content').text(options.content);
    $modal.modal();
  }

  // 点击modal确认按钮的处理函数
  $('#info-modal #confirm').on('click', function () {
    var eventName = $(this).parents('.modal').data('eventName');
    eventConfirm(eventConfirm);
  });
  // 点击modal确认按钮时触发的事件
  function eventConfirm(eventName) {
    switch (eventName) {
      case 'uploadVideo':
        // 上传视频
      break;
      case 'reloadVideo':
        //重新上传
      break;
      case 'deleteVideo':
        // 删除视频
      break;
      case 'deleteAssigment':
        // 删除任务
      break;
    }
  }

  // 向服务器发送删除任务的请求
  function deleteAssigment (testerId, assignmentId, callback) {
    if(assignmentId) {
      var url = '/testers/' + testerId + '/assignments/' + assignmentId;
      $.ajax({
        url: url,
        method: 'delete'
      })
      .done(function (data, status) {
        if(data.status === 0 && data.code === 1) {
          callback();
        }
      })
      .errors(function (errors, status) {
        console.log(errors);
      });
    } 
  }

  // 删除视频
  function deleteVideo (testerId, assignmentId, callback) {
    var url = 'rs.qiniu.com/delete/' + token;
    $.ajax({
      url: url,
      method: 'post'
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        callback();
      }
    })
    .error(function (errors, status) {

    });
  }

  function getAssignmentDetail (testerId, assignmentId, callback){
    var url = '/testers/' + testerId + '/assignments/' + assignmentId;
    $.ajax({
      url: url,
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        callback();
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    })
  }

  function showAssignmentDetail (assignmentDetail) {

  }

});
