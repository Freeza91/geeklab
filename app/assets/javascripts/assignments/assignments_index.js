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

  var testerId = $('#tester-id').val();
  // assignemnt-fresh vue modal
  var assignmentsFresh = new Vue ({
    el: '#assignments-fresh',
    data: {
      type: 'fresh',
      page: 1,
      assignments: [],
      noAssign: false,
      isAll: false
    },
    methods: {
      showOrderOperator: showOrderOperator,
      showSubscribeOperator: showSubscribeOperator,
      showBonus: showBonus,
      // 任务操作
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
