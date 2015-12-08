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

  function orderAssignment (assignment) {
    var assignmentId = assignment.id;
    Geeklab.getAssignment(assignmentId, function (data) {
      switch(data.code) {
        case 1:
          // 抢到
          location.href="/assignments/join";
        break;
        case 2:
          // 未抢到
          alert('名额已抢光');
          assignment.available = false;
          assignment.available_count = 0;
        break;
      }
    });
  }

  function subscribe (assignment) {
    var assignmentId = assignment.id;
    Geeklab.subscribeAssignment(assignmentId, function () {
      switch(data.code) {
        case 1:
          // 订阅成功
          alert('订阅成功');
          assignment.subscribe = true;
        break;
        case 2:
          // 已订阅过
          alert('已经订阅过了');
        break;
        case 3:
          // 任务已结束
        break;
      }
    });
  }

  function unsubscribe (assignment) {
    var assignmentId = assignment.id;
    Geeklab.unsubsribeAssignment (assignmentId, function (data) {
      switch(data.code) {
        case 1:
          // 取消订阅成功
          alert('取消订阅成功');
          assignment.subsribe = false;
        break;
        case 2:
          // 已经取消订阅过
          alert('还没有订阅过')
        break
      }
    });
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
      orderAssignment: orderAssignment,
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
