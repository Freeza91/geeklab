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

  var testerId = $('#tester-id').val();
  // assignemnt-fresh vue modal
  var assignmentsFresh = new Vue ({
    el: '#assignments-fresh',
    data: {
      page: 1,
      assignments: [],
      noAssign: false,
      isAll: false
    },
    methods: {
      showOrderOperator: showOrderOperator,
      showSubscribeOperator: showSubscribeOperator,
      showBonus: showBonus,
    }
  });

  // assignment-finish vue model
  var assignmentsFinish = new Vue({
    el: '#assignments-finish',
    data: {
      page: 1,
      assignments: [],
      noAssign: false,
      isAll: false
    }
  });

  getAssignmentPaging('fresh', 1, function (assignments) {
    if(assignments.length > 0) {
      assignmentsFresh.assignments = assignments;
    } else {
      assignmentsFresh.noAssign = true;
    }
  });

  getAssignmentPaging('finish', 1, function (assignments) {
    if(assignments.length > 0) {
      assignmentsFinish.assignments = assignments;
    } else {
      assignmentsFinish.noAssign = true;
    }
  });

});
