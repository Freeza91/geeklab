$(function () {
  if(!$('body').hasClass('projects_video')) {
    return false;
  }
  var vm = new Vue({
    el: '.evaluate',
    data: {
      quality: 'yes',
      user: 'yes',
      submited: false
    },
    methods: {
      submit: submitEvaluate
    }
  });

  function submitEvaluate (event) {
    event.preventDefault();
    var vmData = vm.$data,
        data = {};
    data.target_user = vmData.user === 'yes' ? true : false;
    data.qualified = vmData.quality === 'yes' ? true : false;
    data.assignment_id = parseInt(vmData.assignmentId);

    var url = '/projects/' + vmData.projectId + '/assignments/'+ vmData.assignmentId + '/comments';
    //var url = '/projects/9/assignments/9/comment';
    $.ajax({
      url: url,
      method: 'post',
      data: {comment: data},
      dataType: 'json'
    })
    .done(function (data, status) {
      console.log(data);
      if(data.status === 0 && data.code === 1) {
        vm.submited = true;
        console.log(vm.submited);
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });
  }
});
