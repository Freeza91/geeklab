$(function () {
  if(!$('body').hasClass('assignments_index')) {
    return false;
  }

  // 抢任务
  // 订阅提醒

  function showOrderOperator (assignment) {
    return !assignment.beginner && assignment.available;
  }

  function showSubscribeOperator (assignment) {
    return !assignment.beginner && !assignment.available;
  }

  function showBonus (assignment) {
    return !assignment.beginner && (assignment.bonus !== 0);
  }

  // 选中视频后触发视频上传
  $('#video').on('change', function () {
    // 清理task-guide
    $('#close').click();
    var file = $(this)[0].files[0];

    if(file) {
      if(file.type.split('/')[0] === 'video') {
        var assignment = assignmentsFresh.assignments[assignmentsFresh.currAssignIndex],
            $progressCircle = assignmentsFresh.currAssign.find('.progressCircle');

        // 清空input的value, 使再次选中同一视频时还能触发change事件
        $(this).val('');

        // 显示上传进度
        assignment.$add('uploading', true);
        // 调用uploader上传视频
        Geeklab.uploader.upload(assignment.id, file, function (progressPercent) {
          Geeklab.showUploadProgress(progressPercent, $progressCircle);
        }, function (data) {
          location.href = '/assignments/join';
          //assignment.video = data.video;
          //assignment.uploading = false;
          //assignment.status = 'wait_check';
          //Geeklab.clearUploadProgresss($progressCircle);
        }, function () {
          assignment.uploading = false;
          assignment.$add('uploadFailed', true);
          //assignment.uploadFailed = true;
          Geeklab.clearUploadProgresss($progressCircle);
        });
      }
    }
  });

  // 取消正在上传
  function cancelUploading (assignment) {
    var $progressCircle = assignmentsFresh.currAssign.find('.progressCircle');
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

  var testerId = $('#tester-id').val();
  // assignemnt-fresh vue modal
  var assignmentsFresh = new Vue ({
    el: '#assignments-fresh',
    data: {
      type: 'fresh',
      page: 1,
      currAssignIndex: 0,
      currAssign: $('#assignments-fresh .assignment-item').first(),
      assignments: [],
      noAssign: false,
      isAll: false
    },
    methods: {
      showOrderOperator: showOrderOperator,
      showSubscribeOperator: showSubscribeOperator,
      showBonus: showBonus,
      // 任务操作
      startAssignment: Geeklab.startAssignment,
      cancelUploading: cancelUploading,
      reuploadVideo: reuploadVideo,
      cancelReupload: cancelReupload,
      order: Geeklab.orderAssignment,
      subscribe: Geeklab.subscribeAssignment,
      unsubscribe: Geeklab.unsubscribeAssignment,
      // 加载下一页
      loadNextPage: Geeklab.loadNextPage
    }
  });

  // assignment-finish vue model
  var assignmentsFinish = new Vue({
    el: '#assignments-finish',
    data: {
      type: 'finish',
      page: 1,
      assignments: [],
      noAssign: false,
      isAll: false
    },
    methods: {
      // 加载下一页
      loadNextPage: Geeklab.loadNextPage
    }
  });

  Geeklab.fetchAssignmentPaging('fresh', 1, function (assignments) {
    if(assignments.length > 0) {
      assignmentsFresh.assignments = assignments;
    } else {
      assignmentsFresh.noAssign = true;
    }
  });

  Geeklab.fetchAssignmentPaging('finish', 1, function (assignments) {
    if(assignments.length > 0) {
      assignmentsFinish.assignments = assignments;
    } else {
      assignmentsFinish.noAssign = true;
    }
  });

});
