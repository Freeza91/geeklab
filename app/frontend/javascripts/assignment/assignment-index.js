$(function () {
  var assignmentBase = require('./assignment-base.js');

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

        // 调用uploader上传视频
        assignmentBase.uploader.upload(assignment.id, file, function () {
          // 显示上传进度
          assignment.$add('uploading', true);
        }, function (progressPercent) {
          assignmentBase.showUploadProgress(progressPercent, $progressCircle);
        }, function (data) {
          location.href = '/assignments/join';
        }, function () {
          assignment.uploading = false;
          assignment.$add('uploadFailed', true);
          assignmentBase.clearUploadProgresss($progressCircle);
        });
      }
    }
  });

  // 取消正在上传
  function cancelUploading (assignment) {
    var $progressCircle = assignmentsFresh.currAssign.find('.progressCircle');
    assignmentBase.uploader.abort();
    assignment.uploading = false;
    assignmentBase.clearUploadProgresss($progressCircle);
  }

  // 上传失败后重新上传
  function reuploadVideo (vm, assignment, event, index) {
    assignment.uploadFailed = false;
    assignmentBase.startAssignment(vm, assignment, event, index);
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
      loading: false,
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
      startAssignment: assignmentBase.startAssignment,
      cancelUploading: cancelUploading,
      reuploadVideo: reuploadVideo,
      cancelReupload: cancelReupload,
      order: assignmentBase.orderAssignment,
      subscribe: assignmentBase.subscribeAssignment,
      unsubscribe: assignmentBase.unsubscribeAssignment,
      // 加载下一页
      loadNextPage: assignmentBase.loadNextPage
    }
  });

  // assignment-finish vue model
  var assignmentsFinish = new Vue({
    el: '#assignments-finish',
    data: {
      type: 'finish',
      page: 1,
      loading: false,
      assignments: [],
      noAssign: false,
      isAll: false
    },
    methods: {
      // 加载下一页
      loadNextPage: assignmentBase.loadNextPage
    }
  });

  function init() {
    Geeklab.showLoading();
    assignmentsFresh.loading = true;
    assignmentsFinish.loading = true;

    assignmentBase.fetchAssignmentPaging('fresh', 1, function (assignments) {
      if(assignments.length > 0) {
        assignmentsFresh.assignments = assignments;
      } else {
        assignmentsFresh.noAssign = true;
      }
      if(assignments.length < 10) {
        assignmentsFresh.isAll = true;
      }
      assignmentsFresh.loading = false;
      Geeklab.removeLoading();
    });

    assignmentBase.fetchAssignmentPaging('finish', 1, function (assignments) {
      if(assignments.length > 0) {
        assignmentsFinish.assignments = assignments;
      } else {
        assignmentsFinish.noAssign = true;
      }
      if(assignments.length < 10) {
        assignmentsFinish.isAll = true;
      }
      assignmentsFinish.loading = false;
    });
  }

  init();

});

