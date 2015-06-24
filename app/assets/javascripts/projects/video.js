$(function () {
  if(!$('body').hasClass('projects_video')) {
    return false;
  }
  var vm = new Vue({
    el: '.evaluate',
    data: {
      quality: 'yes',
      user: 'yes'
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
    data.assignment_id = vmData.assignmentId;

    //var url = '/projects/' + vmData.projectId + '/assignments/'+ vmData.assignmentId + '/comment';
    var url = '/projects/9/assignments/9/comment';
    console.log(data);
    //$.ajax({
      //url: url,
      //method: 'post',
      //data: data
    //})
    //.done(function (data, status) {
      //console.log(data);
      //if(data.status === 0 && status.code === 1) {

      //}
    //})
    //.error(function (errors, status) {

    //});
  }
});
