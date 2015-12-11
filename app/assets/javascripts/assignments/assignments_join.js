$(function () {
  if(!$('body').hasClass('assignments_join')) {
    return false;
  }

  // 显示reasons, 当鼠标移到状态栏图标上时
  $('.assignments-wrp').on('mouseenter', '.status span', function (){
    $(this).parents('.status').find('.reasons').fadeIn();
  });
  $('.assignments-wrp').on('mouseout', '.status span', function (){
    $(this).parents('.status').find('.reasons').fadeOut();
  });

  // 需要的函数
  //* 上传视频
  //* 取消上传
  //* 重新上传
  //* 删除视频
  //* 删除任务
  //* 获取任务详情
  //* 播放视频
  //* 分页加载


  // 发送删除视频的请求
  function sendDeleteVideoRequest (testerId, assignmentId, callback) {
    var url = '/assignments/delete_video';
    $.ajax({
      url: url,
      method: 'delete',
      data: {
        assignment_id: assignmentId
      }
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        callback(data);
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });
  }


  // 发送删除任务的请求
  function sendDeleteAssigmentRequest (testerId, assignmentId, callback) {
    var url = '/assignments/' + assignmentId;
    $.ajax({
      url: url,
      method: 'delete'
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        callback();
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });
  }

  // 获取视频url
  function fetchVideoUrl (testerId, assignmentId, callback) {
    Geeklab.showLoading();

    $.ajax({
      url: '/assignments/get_video',
      data: {
        assignment_id: assignmentId
      }
    })
    .done(function (data, status) {
      if(data.status === 0) {
        setTimeout(function () {
          Geeklab.removeLoading();
          switch(data.code) {
            case 0:
              console.log(data.msg);
            break;
            case 1:
              callback(data.video);
            break;
            case 2:
              // 视频正在转码
              var $modal = $('#info-modal');
              $modal.find('.content').text('视频正在处理中，请稍候');
              $('body').append('<div class="main-mask"></div>');
              $modal.addClass('show');
            break;
          }
        }, 1500);
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });
  }

  function isWaitUpload (assignment) {
    if(assignment.extra_status === 'normal') {
      var isFresh = (assignment.status === 'new') || (assignment.status === 'test'),
          isUploading = assignment.uploading || assignment.uploadFailed;
      return isFresh && !isUploading;
    }
    return false;
  }

  function isWaitCheck(assignment) {
    var isWaitCheck = (assignment.status === 'wait_check') || (assignment.status === 'not_accept'),
        isUploading = assignment.uploading || assignment.uploadFailed,
        isNormal = (assignment.extra_status === 'normal');
    return isNormal && isWaitCheck && !isUploading;
  }

  function canBeDeleted (assignment) {
    var waitCheck = assignment.extra_status === 'normal' && assignment.status === 'wait_check';
    return !assignment.beginner && !waitCheck;
  }

  function showStatus (assignment) {
    if(assignment.beginner) {
      return assignment.status !== 'test';
    }
    return (assignment.extra_status === 'normal') && (assignment.status !== 'new');
  }

  function mapStatus (assignmentStatus) {
    var statusMap = {
      'test': '新手任务',
      'new': '新任务',
      'wait_check': '等待审核',
      'checking': '审核中',
      'not_accept': '审核未通过',
      'success': '任务成功',
      'failed': '任务失败'
    };
    return statusMap[assignmentStatus];
  }

  function showReasons (assignment) {
    if(assignment.reasons && assignment.reasons.length > 0) {
      return assignment.status === 'not_accept' || assignment.status === 'failed';
    }
    return false;
  }

  function showBonus (assignment) {
    return !assignment.beginner && (assignment.bonus !== 0);
  }

  function showRating (assignment) {
    return !assignment.beginner && assignment.credit_record;
  }

  function bonusText (assignment) {
    var credit_record = assignment.credit_record;
    if(credit_record) {
      return credit_record.bonus_credits * credit_record.rating;
    } else {
      return '评分奖励';
    }
  }

  function videoImage(assignment) {
    var imageUrl = '';
    if(assignment.status === 'success') {
      imageUrl =  'url(' + assignment.video + '?vframe/png/offset/0)';
    } else {
      if(assignment.extra_status === 'normal' && assignment.video) {
        imageUrl =  'url(' + assignment.video + '?vframe/png/offset/0)';
      }
    }
    return imageUrl;
  }

  // 选中视频后触发视频上传
  $('#video').on('change', function () {
    // 清理task-guide
    $('#close').click();
    var file = $(this)[0].files[0];

    if(file) {
      if(file.type.split('/')[0] === 'video') {
        var assignment = assignmentsIng.assignments[assignmentsIng.currAssignIndex];
            $progressCircle = assignmentsIng.currAssign.find('.progressCircle');

        // 清空input的value, 使再次选中同一视频时还能触发change事件
        $(this).val('');

        // 显示上传进度
        assignment.uploading = true;
        // 调用uploader上传视频
        Geeklab.uploader.upload(assignment.id, file, function (progressPercent) {
          Geeklab.showUploadProgress(progressPercent, $progressCircle);
        }, function (data) {
          assignment.video = data.video;
          assignment.uploading = false;
          assignment.status = 'wait_check';
          assignment.stop_time = true;
          Geeklab.clearUploadProgresss($progressCircle);
        }, function () {
          assignment.uploading = false;
          assignment.uploadFailed = true;
          Geeklab.clearUploadProgresss($progressCircle);
        });
      }
    }
  });

  // 取消正在上传
  function cancelUploading (assignment) {
    var $progressCircle = assignmentsIng.currAssign.find('.progressCircle');
    Geeklab.uploader.abort();
    assignment.uploading = false;
    Geeklab.clearUploadProgresss($progressCircle);
  }

  // 上传失败后重新上传
  function reuploadVideo (vm, assignment, event, index) {
    assignment.uploadFailed = false;
    Geeklab.startAssignment(vm, assignment, event, index);
    $('.task-pagination').click();
  }

  // 上传失败后取消
  function cancelReupload (assignment) {
    assignment.uploadFailed = false;
  }

  // 播放视频
  function playVideo (assignment) {
    fetchVideoUrl(testerId, assignment.id, function (video) {
      var $modal = $('#video-player');
      // 移除现有的video
      $modal.find('video').remove();
      // 创建新的video
      var $video = document.createElement('video'),
          $source = document.createElement('source');
      $video.controls = 'controls';
      $source.src = video;
      $video.appendChild($source);
      $modal.find('.modal-body').append($video);
      $modal.modal();
    });
  }
  // 关闭视频播放modal是暂停视频
  $('#video-player [data-dismiss="modal"]').on('click', function () {
    $('#video-player video')[0].pause();
  });

  // 显示删除视频确认对话框
  function showDeleteVideoConfirm (vm, index) {
    vm.currAssignIndex = index;
    Geeklab.showConfirmModal({
      eventName: 'deleteVideo',
      content: '确认删除视频?'
    });
  }

  // 显示删除任务确认对话框
  function showDeleteAssignConfirm (vm, index) {
    vm.currAssignIndex = index;
    Geeklab.showConfirmModal({
      eventName: 'deleteAssign',
      content: '任务删除后将无法查看和恢复, 确认删除任务?'
    });
  }

  function uploadVideo (vm, index) {
    vm.currAssignmentIndex = index;
    $('#video').click();
  }

  function deleteVideo (testerId, assignment) {
    sendDeleteVideoRequest(testerId, assignment.id, function (data) {
      assignment.status = assignment.beginner ? 'test': 'new';
      assignment.video = '';
      assignment.stop_time = false;
    });
  }

  function deleteAssignment () {
    sendDeleteAssigmentRequest(testerId, assignment.id, function (data) {
      var hash = location.hash.substr(1),
          assignmentsVm;

      // 使用hash判断当前显示的任务列表tab
      switch(hash) {
        case 'ing':
          assignmentsVm = assignmentsIng;
        break;
        case 'done':
          assignmentsVm = assignmentsDone;
        break;
      }
      assignmentsVm.assignments.$remove(assignmentsVm.currAssignIndex);
    });
  }

  $('#confirm').on('click', function () {
    var eventName = $(this).parents('.operate').data('event-name');
        assignment = assignmentsIng.assignments[assignmentsIng.currAssignIndex];
    switch(eventName) {
      case 'deleteVideo':
        deleteVideo(testerId, assignment);
      break;
      case 'deleteAssign':
        deleteAssignment(testerId, assignment);
      break;
    }
    $('#confirm-modal').removeClass('show');
    $('body .main-mask').remove();
  });


  // 加载下一页数据for assignments_ing
  function loadNextPageForIng (vm) {
    var page = vm.page + 1;
    Geeklab.fetchAssignmentPaging('ing', page, function (assignments) {
      if(assignments.length > 0) {
        var assignment;
        for(var i = 0, len = assignments.length; i < len; i++) {
          assignment = assignments[i];
          assignment.uploading = false;
          assignment.uploadFailed = false;
          if(!assignment.beginner && assignment.extra_status === 'normal') {
            assignment.deadline = generateDeadline(assignment.expired_time);
          }
        }
        vm.assignments = vm.assignments.concat(assignments);
        vm.page = vm.page + 1;
      }
      if(assignments.length < 10) {
        vm.isAll = true;
      }
    });
  }

  // 倒计时
  function generateDeadline (expiredTimeCount) {
    // 初始化倒计时
    var count = expiredTimeCount,
        days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0,
        deadline = [];

     days = ~~ (count / (24 * 60 * 60 )); //天
     hours = ~~ ((count / (60 * 60 )) % 24); //小时
     minutes = ~~ ((count / 60 ) % 60); //分钟
     seconds = ~~ (count % 60); //秒

     deadline[0] = days < 10 ? '0' + days : days;
     deadline[1] = hours < 10 ? '0' + hours : hours;
     deadline[2] = minutes < 10 ? '0' + minutes : minutes;
     deadline[3] = seconds < 10 ? '0' + seconds : seconds;
     return deadline;
  }

  function updateDeadline (assignments) {
    var day,
        hour,
        minute,
        assignment;
    for(var i = 0, len = assignments.length; i < len; i++) {
      assignment = assignments[i];
      if(assignment.count <= 0) {
        continue;
      }
      if(assignment.beginner || assignment.stop_time) {
        continue;
      }
      assignment.expired_time = assignment.expired_time - 1;
      assignment.deadline = generateDeadline(assignment.expired_time);
    }
  }

  var testerId = $('#tester-id').val();
  var assignmentsIng = new Vue({
    el: '#assignments-ing',
    data: {
      type: 'ing',
      page: 1,
      currAssignIndex: 0,
      currAssign: $('#assignments-ing .assignment-item').first(),
      assignments: [],
      noAssign: false,
      isAll: false
    },
    methods: {
      // operator切换相关函数
      isWaitUpload: isWaitUpload,
      isWaitCheck: isWaitCheck,
      // 是否能删除
      canBeDeleted: canBeDeleted,
      // 数据显示
      showStatus: showStatus,
      mapStatus: mapStatus,
      showReasons: showReasons,
      showBonus: showBonus,
      videoImage: videoImage,
      // 任务相关操作函数
      startAssignment: Geeklab.startAssignment,
      cancelUploading: cancelUploading,
      reuploadVideo: reuploadVideo,
      cancelReupload: cancelReupload,
      showDeleteVideoConfirm: showDeleteVideoConfirm,
      showDeleteAssignConfirm: showDeleteAssignConfirm,
      playVideo: playVideo,
      order: Geeklab.orderAssignment,
      subscribe: Geeklab.subscribeAssignment,
      unsubscribe: Geeklab.unsubscribeAssignment,
      // 加载下一页
      loadNextPage: loadNextPageForIng
    }
  });

  var assignmentsDone = new Vue({
    el: '#assignments-done',
    data: {
      type: 'done',
      page: 1,
      currAssignIndex: 0,
      assignments: [],
      noAssign: false,
      isAll: false
    },
    methods: {
      // 数据显示
      mapStatus: mapStatus,
      showReasons: showReasons,
      showBonus: showBonus,
      showRating: showRating,
      bonusText: bonusText,
      videoImage: videoImage,
      // 操作
      showDeleteAssignConfirm: showDeleteAssignConfirm,
      playVideo: playVideo,
      // 加载下一页
      loadNextPage: Geeklab.loadNextPage
    }
  });

  Geeklab.showLoading();
  Geeklab.fetchAssignmentPaging('ing', 1, function (assignments) {
    if(assignments.length > 0) {
      var assignment;
      for(var i = 0, len = assignments.length; i < len; i++) {
        assignment = assignments[i];
        assignment.uploading = false;
        assignment.uploadFailed = false;
        if(!assignment.beginner && assignment.extra_status === 'normal') {
          assignment.deadline = generateDeadline(assignment.expired_time);
        }
      }
      assignmentsIng.assignments = assignments;
      setInterval(function () {
        updateDeadline(assignmentsIng.assignments);
      }, 1000);
    } else {
      assignmentsIng.noAssign = true;
    }
    Geeklab.removeLoading();
  });

  Geeklab.fetchAssignmentPaging('done', 1, function (assignments) {
    if(assignments.length > 0) {
      assignmentsDone.assignments = assignments;
    } else {
      assignmentsDone.noAssign = true;
    }
  });

});
