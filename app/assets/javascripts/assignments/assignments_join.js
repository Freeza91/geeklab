$(function () {
  if(!$('body').hasClass('assignments_join')) {
    return false;
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

  var assignmentsIng = new Vue({
    el: '#assignments-ing',
    data: {
      page: 1,
      assignments: [],
    },
    methods: {
      showStatus: showStatus,
      mapStatus: mapStatus,
      showReasons: showReasons,
      showBonus: showBonus,
    }
  });

  var assignmentsDone = new Vue({
    el: '#assignments-done',
    data: {
      page: 1,
      assignments: []
    },
    methods: {
      mapStatus: mapStatus,
      showReasons: showReasons,
      showBonus: showBonus,
      showRating: showRating,
      bonusText: bonusText
    }
  });

  getAssignmentPaging('ing', 1, function (assignments) {
    assignmentsIng.assignments = assignments;
  });
  getAssignmentPaging('done', 1, function (assignments) {
    assignmentsDone.assignments = assignments;
  });

});
