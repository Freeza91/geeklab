$(function () {
  if(!$('body').hasClass('projects_video')) {
    return false;
  }

  var player = $('#video')[0];
  var isRating = $('#is-rating').val();


  $('.rating-star').on('click', function () {
    if(isRating === 'true' || isRating === true) {
      return false;
    }
    var rating = 5 - $(this).data('rating'),
        projectId = $('#project-id').val(),
        assignmentId = $('#assignment-id').val();
    //sendRatingRequest(projectId, assignmentId, rating, function (data) {
      //isRating = true;
    //});
    console.log(rating);
  });

  function toggleItemBodyContent (event) {
    var $target = $(event.target),
        selector = $target.data('target');
    $target.parents('ul').find('a.active').removeClass('active');
    $target.addClass('active');
    $('.video-info-section.active').hide().removeClass('active');
    $(selector).fadeIn().addClass('active');
  }

  function sendRatingRequest (projectId, assignmentId, rating, callback) {
    var url = '/assignments/' + assignmentId + '/rating';
    $.ajax({
      url: url,
      method: 'post',
      data: {
        project_id: projectId,
        rating: rating
      },
      success: function (data) {
        console.log(data);
        if(data.status === 0 && data.code === 1) {
          callback(data);
        }
      },
      error: function (xhr, textStatus, errors) {
        console.log(data);
      }
    });

  }
  $('[role="tablist"] a').on('click', toggleItemBodyContent);

  // 添加注释相关函数
  function transformTimepoint (timepoint) {
    var seconds = timepoint % 60,
        minutes = (timepoint - seconds) / 60;
    seconds = seconds > 10 ? seconds : '0' + seconds;
    return minutes + ':' + seconds;
  }

  function setVideoTime (timepoint) {
    var videoDuration = player.seekable.end(0);
    console.log(videoDuration);
    if(timepoint <= videoDuration) {
      player.currentTime = timepoint;
    }
  }

  function sendCreateCommentRequest (comment, callback) {

  }

  function sendUpdateCommentRequest (comment, callback) {

  }

  function sendDeleteCommentRequest (comment, callback) {

  }

  function initFreshComment (vm) {
    vm.freshComment.$set('timepoint', Math.floor(player.currentTime));
    vm.freshComment.$set('editing', true);
    if(vm.pause) {
      player.pause();
    }
  }

  function addComment (vm) {
    var freshComment = vm.freshComment;
    console.log(freshComment.desc);
    if(freshComment.desc) {
      // Todo 发送新建comment的请求给后台，然后在成功后的回调中进行下面的操作
      vm.comments.push({
        timeline: freshComment.timepoint,
        desc: freshComment.desc
      });
      vm.freshComment.$set('timepoint', 0);
      vm.freshComment.$set('desc', '');
    } else {
      // 注释内容不能为空
      return false;
    }
  }

  function cancelAddComment (vm) {
    vm.freshComment.$set('timepoint', 0);
    vm.freshComment.$set('desc', '');
    vm.freshComment.$set('editing', false);
  }

  function makeCommentEditable (vm, commentIndex) {
    vm.editable.$set(commentIndex, true);
  }

  function updateComment (vm, commentIndex, event) {
    var $textarea = $(event.target).parents('.comment-item').find('textarea'),
        newComment = $textarea.val();
    if(newComment) {
      vm.comments[commentIndex].$set('desc', newComment);
      vm.editable.$set(commentIndex, false);
    } else {
      // 注释不能为空
      return false;
    }
  }

  function cancelEditComment (vm, commentIndex, event) {
    vm.editable.$set(commentIndex, false);
    var $textarea = $(event.target).parents('.comment-item').find('textarea');
    $textarea.val(vm.comments[commentIndex].desc);
  }

  function deleteComment () {
  }

  var commentVm = new Vue ({
    el: '#comment',
    data: {
      pause: true,
      freshComment: {
        timepoint: 0,
        desc: '',
        editing: false
      },
      comments: [
        {
          id: 0,
          timeline: 30,
          desc: '这是一条注释'
        },
        {
          id: 1,
          timeline: 100,
          desc: '这是另一条注释'
        },
        {
          id: 2,
          timeline: 160,
          desc: 'this is an comment too'
        }
      ],
      editable: [false, false, false]
    },
    methods: {
      transformTimepoint: transformTimepoint,
      setVideoTime: setVideoTime,
      initFreshComment: initFreshComment,
      makeCommentEditable: makeCommentEditable,
      cancelEditComment: cancelEditComment,
      addComment: addComment,
      cancelAddComment: cancelAddComment,
      updateComment: updateComment,
      deleteComment: deleteComment,
    }
  });

});
