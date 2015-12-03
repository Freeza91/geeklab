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

  var assignmentsIng = new Vue ({
    el: '#assignments-ing',
    data: {
      page: 1,
      assignments: [],
    },
    methods: {
      showBonus: showBonus,
      showRating: showRating,
      bonusText: bonusText
    }
  });
  getAssignmentPaging('ing', 1, function (assignments) {
    assignmentsIng.assignments = assignments;
  });

});
