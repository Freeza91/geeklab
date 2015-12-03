$(function () {
  if(!$('body').hasClass('assignments_index')) {
    return false;
  }

  // 抢任务
  // 订阅提醒

  // 分页
  function getAssignmentPaging (type, page, callback) {
    var url = '/assignments/' + type;
    $.ajax({
      url: url,
      data: {page: page},
      dataType: 'json',
      success: function (data, status) {
        callback(data.assignments);
      },
      errror: function (xhr, textStatus, errors) {
        console.log(errors);
      }
    });
  }

  function showOrderOperator (assignment) {
    return !assignment.beginner && assignment.available;
  }

  function showSubscribeOperator (assignment) {
    return !assignment.beginner && !assignment.available;
  }

  function showBonus (assignment) {
    return !assignment.beginner && (assignment.bonus !== 0);
  }

  // assignemnt-fresh vue modal
  var assignmentsFresh = new Vue ({
    el: '#assignments-fresh',
    data: {
      page: 1,
      assignments: [],
    },
    methods: {
      showOrderOperator: showOrderOperator,
      showSubscribeOperator: showSubscribeOperator,
      showBonus: showBonus,
    }
  });

  var assignmentsFinish = new Vue({
    el: '#assignments-finish',
    data: {
      page: 1,
      assignments: []
    }
  });

  getAssignmentPaging('fresh', 1, function (assignments) {
    assignmentsFresh.assignments = assignments;
  });
  getAssignmentPaging('finish', 1, function (assignments) {
    assignmentsFinish.assignments = assignments;
  });


});
