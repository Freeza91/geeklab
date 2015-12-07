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

  // 获取assgnment分页数据
  function getAssignmentPaging (type, page, callback) {
    var url = '/assignments/' + type;
    $.ajax({
      url: url,
      data: {page: page},
      datatype: 'json',
      success: function (data, status) {
        callback(data.assignments);
      },
      errror: function (xhr, textstatus, errors) {
        console.log(errors);
      }
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
        isUploading = assignment.uploading || assignment.uploadFailed;
    return isWaitCheck && !isUploading;
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

  function startAssignment (vm, assignment, event, index) {
    Geeklab.showLoading();
    var assignmentId = assignment.id;
    assignmentDetailVm.id = assignmentId;
    vm.currAssignIndex = index;
    vm.currAssign = $(event.target).parents('.assignment-item');
    Geeklab.fetchAssignmentDetail(testerId, assignmentId, function (project) {
      // 任务为手机应用时生成二维码
      if(assignment.device !== 'web') {
        Geeklab.fetchQrcodeToken(assignmentId, function (token) {
          var uploadUrl = location.origin
                        + "/assignments/upload?"
                        + "auth_token="
                        + token
                        + "&id="
                        + assignmentId;
          qrcode.clear();
          qrcode.makeCode(uploadUrl);
        });
      }

      // 赋值数据给assignmentDetailVm
      assignmentDetailVm.project = project;
      assignmentDetailVm.taskLen = project.tasks.length;
      assignmentDetailVm.stepLen = project.tasks.length + 6;
      setTimeout(function () {
        Geeklab.removeLoading();
        $('#assignment-detail').modal();
      }, 1000);
    });
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
          console.log('上传成功');
          assignment.video = data.video;
          assignment.uploading = false;
          assignment.status = 'wait_check';
          Geeklab.clearUploadProgresss($progressCircle);
        }, function () {
          console.log('上传失败');
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
    startAssignment(vm, assignment, event, index);
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

  var assignmentDetailVm = new Vue({
    el: '#assignment-detail',
    data: {
      id: '',
      progress: 'requirement',
      curStepContent: '',
      curStepIndex: 1,
      stepLen: 0,
      taskLen: 0,
      project: {},
      nextStepText: '好的',
      uplodging: false
    },
    methods: {
      prev: prevStep,
      next: nextStep,
      lastStep: lastStep,
      refreshQrImage: refreshQrImage,
      mapDevice: mapDevice,
      close: close
    }
  });

  function prevStep (vm) {
    vm.curStepIndex -= 1;
    switch(vm.progress) {
      case 'prepare':
        vm.progress = 'requirement';
        vm.nextStepText = '好的';
      break;
      case 'help':
        vm.progress = 'prepare';
        vm.nextStepText = '好了';
      break;
      case 'hint':
        vm.progress = 'help';
        vm.nextStepText = '开始任务';
      break;
      case 'situation':
        vm.progress = 'hint';
        vm.nextStepText = '接下来 →';
      break;
      case 'work-on':
      if(vm.curStepIndex === 5) {
        vm.curStepContent = vm.project.desc;
        vm.progress = 'situation';
      } else {
        vm.curStepContent = vm.project.tasks[vm.curStepIndex - 6].content;
      }
      break;
      case 'work-done':
        vm.curStepContent = vm.project.tasks[vm.curStepIndex - 6].content;
        vm.progress = 'work-on';
        vm.nextStepText = '接下来 →';
      break;
    }
  }

  function nextStep (vm) {
    vm.curStepIndex += 1;
    switch(vm.progress) {
      case 'requirement':
        vm.progress = 'prepare';
        vm.nextStepText = '好了';
      break;
      case 'prepare':
        vm.progress = 'help';
        vm.nextStepText = '开始任务';
      break;
      case 'help':
        vm.progress = 'hint';
        vm.nextStepText = '接下来 →';
      break;
      case 'hint':
        vm.progress = 'situation';
        vm.curStepContent = vm.project.desc;
        vm.nextStepText = '接下来 →';
      break;
      case 'situation':
        vm.progress = 'work-on';
        vm.curStepContent = vm.project.tasks[0].content;
      break;
      case 'work-on':
      if(vm.curStepIndex - 6 === vm.taskLen) {
        vm.progress = 'work-done';
      } else {
        vm.curStepContent = vm.project.tasks[vm.curStepIndex - 6].content;
      }
      break;
    }
  }

  function lastStep (vm) {
    vm.progress = 'work-done';
    vm.curStepIndex = vm.stepLen;
  }

  function close(vm) {
    $('#assignment-detail').modal('hide');
  }

  function refreshQrImage (vm, event) {
    var $target = $(event.target);
    if($target.hasClass('disable')) {
      return false;
    }
    $target.addClass('disable');
    var $qrcode = $('#upload-qrcode');
    qrcode.clear();
    $qrcode.find('.fa-refresh').addClass('fa-spin');
    $qrcode.find('.img-mask').css({
      display: 'block'
    });
    Geeklab.fetchQrcodeToken(vm.id, function (token) {
      var uploadUrl = location.origin
                    + "/assignments/upload?"
                    + "auth_token="
                    + token
                    + "&id="
                    + vm.id;
      setTimeout(function () {
        qrcode.makeCode(uploadUrl);
        $qrcode.find('.fa-refresh').removeClass('fa-spin');
        $qrcode.find('.img-mask').removeAttr('style');
        $target.removeClass('disable');
      }, 1000)
    });
  }

  function mapDevice (platform, device) {
    if(device === 'web') {
      return '电脑'
    }
    var map = {
      'iospad': 'iPad',
      'iosphone': 'iPhone',
      'androidphone': 'Android Phone',
      'androidpad': 'Android Pad',
    }
    return map[platform + device];
  }

  function uploadVideo (vm, index) {
    vm.currAssignmentIndex = index;
    $('#video').click();
  }

  function deleteVideo (testerId, assignment) {
    sendDeleteVideoRequest(testerId, assignment.id, function (data) {
      console.log(data)
      assignment.status = assignment.beginner ? 'test': 'new';
      assignment.video = '';
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



  var testerId = $('#tester-id').val();
  var assignmentsIng = new Vue({
    el: '#assignments-ing',
    data: {
      page: 1,
      currAssignIndex: 0,
      currAssign: $('#assignments-ing .assignment-item').first(),
      assignments: [],
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
      startAssignment: startAssignment,
      cancelUploading: cancelUploading,
      showDeleteVideoConfirm: showDeleteVideoConfirm,
      showDeleteAssignConfirm: showDeleteAssignConfirm,
      reuploadVideo: reuploadVideo,
      cancelReupload: cancelReupload,
      playVideo: playVideo
    }
  });

  var assignmentsDone = new Vue({
    el: '#assignments-done',
    data: {
      page: 1,
      currAssignIndex: 0,
      assignments: []
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
      playVideo: playVideo
    }
  });

  getAssignmentPaging('ing', 1, function (assignments) {
    for(var i = 0, len = assignments.length; i < len; i++) {
      assignments[i].uploading = false;
      assignments[i].uploadFailed = false;
    }
    assignmentsIng.assignments = assignments;
  });
  getAssignmentPaging('done', 1, function (assignments) {
    assignmentsDone.assignments = assignments;
  });

});
