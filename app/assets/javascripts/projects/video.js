$(function () {
  if(!$('body').hasClass('projects_video')) {
    return false;
  }

  var player = $('#video')[0],
      isRating = $('#is-rating').val(),
      projectId = $('#project-id').val(),
      assignmentId = $('assignment-id').val(),
      commentVm;

  $('.rating-star').on('click', function () {
    if(isRating === 'true' || isRating === true) {
      return false;
    }
    var rating = 5 - $(this).data('rating');
        //projectId = $('#project-id').val(),
        //assignmentId = $('#assignment-id').val();
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

  // confirm modal 相关操作
  function showConfirmModal (options) {
    var $modal = $('#confirm-modal');
    $modal.data('eventName', options.eventName);
    $modal.find('.content').text(options.content);
    $('body').append('<div class="main-mask"></div>');
    $modal.addClass('show');
  }

  function confirmClose() {
    $('#confirm-modal').removeClass('show');
    $('body .main-mask').remove();
  }
  $('.js-operate-cancel').on('click', function () {
    $(this).parents('.operate').removeClass('show');
    $('body .main-mask').remove();
  });

  function showInfoModal (infoContent) {
    var $modal = $('#info-modal');
    $modal.find('.content').text(infoContent);
    $('body').append('<div class="main-mask"></div>');
    $modal.addClass('show');
  }

  function eventConfirm(eventName) {
    switch (eventName) {
      case 'deleteComment':
        // 删除注释
        deleteComment();
      break;
    }
  }

  $('#confirm').on('click', function () {
    var eventName = $('#confirm-modal').data('event-name');
    eventConfirm(eventName);
  });

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
        showInfoModal('评分失败，请稍后重试');
      }
    });

  }
  $('[role="tablist"] a').on('click', toggleItemBodyContent);

  // 添加注释相关函数
  function transformTimepoint (timepoint) {
    var seconds = timepoint % 60,
        minutes = (timepoint - seconds) / 60;
    seconds = seconds >= 10 ? seconds : '0' + seconds;
    return minutes + ':' + seconds;
  }

  function setVideoTime (timepoint) {
    var videoDuration = player.seekable.end(0);
    console.log(videoDuration);
    if(timepoint <= videoDuration) {
      player.currentTime = timepoint;
    }
  }

  function getFeedbacks (assignmentId, callback) {
    var url = '/assignments/' + assignmentId + '/feedbacks'
    $.ajax({
      url: url,
      success: function (data) {
        console.log(data)
          if(data.status === 0 && data.code === 1) {
            callback(data.feedbacks)
          }
      },
      error: function (xhr, textStatus, errors) {
        console.log(errors);
        showInfoModal('获取注释失败');
      }
    });
  }

  function sendCreateCommentRequest (comment, callback) {
    var url = '/assignments/' + assignmentId + '/feedbacks';
    $.ajax({
      url: url,
      method: 'post',
      data: {
        feedbacks: comment
      },
      success: function (data) {
        console.log(data);
        if(data.status === 0 && data.code === 1) {
          callback(data.feedback);
        }
      },
      error: function (xhr, textStatus, errors) {
        console.log(errors);
        showInfoModal('创建失败,请稍后重试');
      }
    });
  }

  function sendUpdateCommentRequest (comment, callback) {
    var url = '/assignments/' + assignmentId + '/feedbacks/' + comment.id;
    $.ajax({
      url: url,
      method: 'put',
      data: {
        feedback: comment
      },
      success: function (data) {
        console.log(data);
        if(data.status === 0 && data.code === 1) {
          callback();
        }
      },
      error: function (xhr, textStatus, errors) {
        console.log(errors);
        showInfoModal('更新失败, 请稍后重试');
      }
    });
  }

  function sendDeleteCommentRequest (commentId, callback) {
    var url = '/assignments/' + assignmentId + '/feedbacks/' + commentId;
    $.ajax({
      url: url,
      method: 'delete',
      success: function (data) {
        console.log(data);
        if(data.status === 0 && data.code === 1) {
          callback();
        }
      },
      error: function (xhr, textStatus, errors) {
        console.log(errors);
      }
    });
  }

  function initFreshComment (vm) {
    vm.freshComment.$set('timepoint', Math.floor(player.currentTime));
    vm.freshComment.$set('editing', true);
    if(vm.pause) {
      player.pause();
    }
  }

  function addComment (vm) {
    vm.freshComment.saving = true;
    var freshComment = {
      timeline: vm.freshComment.timepoint,
      desc: vm.freshComment.desc
    };
    if(vm.freshComment.desc) {
      sendCreateCommentRequest(freshComment, function (feedback) {
        vm.comments.push(feedback);
        vm.freshComment.$set('saving', false);
        vm.freshComment.$set('editing', false);
        vm.freshComment.$set('timepoint', 0);
        vm.freshComment.$set('desc', '');
      });
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
    vm.editing.$set(commentIndex, true);
  }

  function updateComment (vm, commentIndex, event) {
    // 设置comment的saving状态为true
    vm.saving.$set(commentIndex, true)

    var $textarea = $(event.target).parents('.comment-item').find('textarea'),
        newCommentDesc = $textarea.val(),
        comment = vm.comments[commentIndex];
    if(newCommentDesc) {
      var newComment = {
        id: comment.id,
        timeline: comment.timeline,
        desc: comment.desc
      };
      sendUpdateCommentRequest(newComment, function () {
        comment.$set('desc', newCommentDesc);
        vm.saving.$set(commentIndex, false)
        vm.editing.$set(commentIndex, false);
      });
    } else {
      // 注释不能为空
      return false;
    }
  }

  function cancelEditComment (vm, commentIndex, event) {
    vm.editing.$set(commentIndex, false);
    var $textarea = $(event.target).parents('.comment-item').find('textarea');
    $textarea.val(vm.comments[commentIndex].desc);
  }

  function showDeleteConfirm (vm, commentIndex) {
    var comment = vm.comments[commentIndex].desc.substr(0, 10);
    showConfirmModal({
      eventName: 'deleteComment',
      content: '确定要删除注释"' + comment + '"'
    });
    vm.currCommentIndex = commentIndex;
  }

  function deleteComment () {
    var commentId = commentVm.comments[commentVm.currCommentIndex].id;
    console.log(commentId);
    sendDeleteCommentRequest (commentId, function () {
      commentVm.comments.$remove(commentVm.currCommentIndex);
      confirmClose();
    });
  }

  // 初始化comment Vue 对象
  getFeedbacks(assignmentId, function (feedbacks) {
    var commentVmData = {
      pause: true,
      currCommentIndex: 0,
      freshComment: {
        timepoint: 0,
        desc: '',
        editing: false,
        saving: false
      },
      comments: feedbacks,
      editing: [],
      saving: []
    }

    for (var i = 0, len = feedbacks.length; i < len; i++) {
      commentVmData.editing.push(false);
      commentVmData.saving.push(false);
    }

    commentVm = new Vue ({
      el: '#comment',
      data: commentVmData,
      methods: {
        transformTimepoint: transformTimepoint,
        setVideoTime: setVideoTime,
        initFreshComment: initFreshComment,
        makeCommentEditable: makeCommentEditable,
        cancelEditComment: cancelEditComment,
        addComment: addComment,
        cancelAddComment: cancelAddComment,
        updateComment: updateComment,
        showDeleteConfirm: showDeleteConfirm
      }
    });

  });

});
