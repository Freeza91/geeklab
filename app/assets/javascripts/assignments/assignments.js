$(function () {
  if(!$('body').hasClass('assignments_index')) {
    return false;
  }
  // function list
    //上传视频
    //删除视频
    //覆盖重新上传
    //删除任务
    //获取任务详细信息
    //显示过期任务数
    //播放视频
    //任务倒计时
    // 瀑布流加载
    
  // 保存testId
  var testerId = $('.assignment-list').data('testerId');
  var assignmentId = 0; // 当前执行操作的任务id
  var $card; // 当前执行操作的任务卡片


  // 瀑布流加载，监听window滚动事件
  $(window).on('scroll', function () {
    // 页面高度
    var pageHeight = $(document).height();
    // 视窗高度
    var viewHeight = $(window).height();
    // 滚动高度
    var scrollTop = $(window).scrollTop();
     //滚动到底部时自动加载新任务
    if((viewHeight + scrollTop) > (pageHeight - 10)) {
      //getAssignmentPaging(function (assignments) {
        appendAssignments();
      //});
    }
  });
  $('.load-more').on('click', function () {
    //getAssignmentPaging(function (assignments) {
      appendAssignments();
    //});
  });

  // 上传视频表单的submit事件处理
  // 获取token
  // 上传视频
  $('#upload-form').on('submit', function(event) {
    // 阻止默认事件
    event.stopPropagation();
    event.preventDefault(); 

    var $form = $(event.target);

    var file = $form.find('[type="file"]')[0].files[0];
    assignmentId = $form.data('assignmentId');

    if(file) {
      getUploadToken(testerId, assignmentId, function (token) {
        if(token) {
          uploadVideo(file, token, function (msg) {
            // 上传成功后的回调
            console.log(msg);
            $card.find('.content img').attr('src', '/assets/logo/logo.png');
            $('#video-upload').modal('hide');
          });
        }
      });
    }
  });

  // 点击任务标题显示任务说明
  //$('[action="getAssignmentDetail"]').on('click', function () {
  $('.assignments-wrp').on('click', '[action="getAssignmentDetail"]', function () {
    var $this = $(this);
    var assignmentId = $this.parents('.card').data('assignmentId');
    //getAssignmentDetail(testerId, assignmentId, function (assignmentDetail) {
      // 测试assignment detail modal view
      var assignmentDetail = 'test';
      showAssignmentDetail(assignmentDetail);
    //});
  });

  // 上传视频按钮的click事件处理函数
  $('.assignments-wrp').on('click', '.video-upload',  function () {
    var $this = $(this);
    // 设置当前操作的卡片
    $card = $this.parents('.card');

    assignmentId = $this.parents('card').data('assignmentId');
    $('#video-upload').modal();
  });

  // 删除任务按钮的click事件处理函数
  // 在 .assignments-wrp 做事件代理
  $('.assignments-wrp').on('click', '.assignment-del', function () {

    var $this = $(this);
    $card = $this.parents('.card');
    assignmentId = $card.data('assignmentId');

    var options = {
      title: '对任务不感兴趣?',
      content: '任务删除后将无法查看和恢复，确认删除任务?',
      eventName: 'deleteAssignment'
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
    // 构造formData
    var formData = new FormData();
    formData.append('token', token);
    formData.append('file', file);
    formData.append('accept', 'application/json');
    // ajax上传
    $.ajax({
      url: 'http://upload.qiniu.com',
      method: 'post',
      data: formData,
      cache: false,
      processData: false, //Dont't process the file
      contentType: false
      // Set content type to false as jQuery will tell the server its a query string request.
      // 不太懂是什么意思，先写着
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

 
  // 显示操作的提示信息
  /* @param options  Object 显示的提示信息
   * options.title  String 标题
   * options.content String 内容
   * options.eventName String 确认按钮将会触发的事件
   */
  function showInfoModal (options) {
    var $modal = $('#confirm-modal');
    $modal.data('eventName', options.eventName);
    //$modal.find('.modal-body .title').text(options.title);
    $modal.find('.modal-body .content').text(options.content);
    $modal.modal();
  }

  // 点击modal确认按钮的处理函数
  $('#confirm-modal #confirm').on('click', function () {
    var eventName = $(this).parents('.modal').data('eventName');
    eventConfirm(eventName);
  });
  // 点击modal确认按钮时触发的事件
  function eventConfirm(eventName) {
    switch (eventName) {
      case 'reloadVideo':
        //重新上传
      break;
      case 'deleteVideo':
        // 删除视频
      break;
      case 'deleteAssignment':
        // 删除任务
        console.log('assignment deleted');
        $card.remove();
        //deleteAssigment (testerId, assignmentId, function () {
          // 删除任务后的回调， 将当前卡片重页面上移除  
          //$card.remove();
        //});
      break;
    }
    $('#confirm-modal').modal('hide');
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
    var url = 'http://rs.qiniu.com/delete/' + token;
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
        console.log(data);
        callback();
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    })
  }

  function showAssignmentDetail (assignmentDetail) {
    console.log(assignmentDetail);
    $('#assignment-detail').modal();
  }

  function getInvalidAssignmentCount (testerId) {

  }

  // 任务过期时间倒计时
  var countDownInterval = []; // 倒计时interval id list
  var assignmentDeadline = []; // 任务截止事时间
  $('.time').each(function (index, item) {
    //countDownInterval[index] = setInterval(assignmentTimeCountDown(deadline, $ele));
    var $ele = $(item),
        deadline = $ele.data('deadline');
        now = new Date();

    assignmentDeadline[index] = new Date(deadline);
    var times = assignmentDeadline[index] - now;

    if(times <= 0) {
      return false;
    }

    assignmentTimeCountDown(times, $ele);

    // 周期执行倒计时函数，周期为1s
    countDownInterval[index] = setInterval(function () {
      var deadline = assignmentDeadline[index],
          now = new Date(),
          times = deadline - now;
      if(times <= 0) {
        clearInterval(countDownInterval[index]);
        return false;
      }
      assignmentTimeCountDown(times, $ele);
    }, 1000);
  });

  function assignmentTimeCountDown(count, $ele) {
    var days = ~~ (count / (24 * 60 * 60 * 1000)), //天
        hours = ~~ ((count / (60 * 60 * 1000)) % 24), //小时
        minutes = ~~ ((count / (60 * 1000)) % 60), //分钟
        seconds = ~~ ((count / 1000) % 60); //秒
    $ele.text(days + '天' + hours + ':' + minutes + ':' + seconds);
  }

  function getAssignmentPaging (page, callback) {
    var url = '';

    $.ajax({
      url: url
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        if(data.assignments.length !== 0) {
          callback(data);
        } else {
          $('window').unbind('scroll');
          $('.load-more').unbind('click');
          $('.load-more p').text('没有更多了');
        }
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    })
  }

  function appendAssignments (assignments) {
    var $assignmentsWrp = $('.assignments-wrp'); 
    // 复制一个card作为模板
    var $assignmentCard = $('.card:last').clone();
    var cards = [];
    for(var i = 0; i < 5; i++) {
      $assignmentCard.find('.title span:first').text(i);;
      // 清除图片src
      $assignmentCard.find('.content img').removeAttr('src');
      // 将每个任务的html暂存在数组中
      cards.push('<div class="card">' + $assignmentCard.html() + '</div>');
    }
    $assignmentsWrp.append(cards.join(''));
  }
  
});
    // 值一个card
