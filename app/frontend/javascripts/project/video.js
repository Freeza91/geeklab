$(function () {
  if(!$('body').hasClass('projects_video')) {
    return false;
  }

  var player = $('#video')[0],
      isRating = $('#is-rating').val(),
      projectId = $('#project-id').val(),
      assignmentId = $('#assignment-id').val(),
      rating = 0,
      commentVm,
      currentTimeInterval;

  $('.rating-star').on('click', function () {
    if(isRating === 'true' || isRating === true) {
      return false;
    }
    rating = 5 - $(this).data('rating');
    Geeklab.showConfirmModal({
      modal: '#video-op-confirm',
      eventName: 'rating',
      content: '确定评分为"' + rating + '星"? 提交后无法修改'
    });
  });

  function sendRating () {
    sendRatingRequest(projectId, assignmentId, rating, function (data) {
      isRating = true;
      confirmClose();
    }, function () {
      showOpError('评分失败, 请稍后重试');
    });
  }

  function toggleItemBodyContent (event) {
    var $target = $(event.target),
        selector = $target.data('target');
    $target.parents('ul').find('a.active').removeClass('active');
    $target.addClass('active');
    $('.video-info-section.active').hide().removeClass('active');
    $(selector).fadeIn().addClass('active');
  }

  // confirm modal 相关操作
  function confirmClose() {
    var $modal = $('#video-op-confirm');
    $modal.removeClass('show');
    $modal.find('.error-hint').hide().text('')
    $modal.find('.loading').hide();
    $('body .main-mask').remove();
  }

  function showOpError(error) {
    var $modal = $('#video-op-confirm');
    $modal.find('.loading').hide();
    $modal.find('.error-hint').text(error).show();
  }

  function eventConfirm(eventName) {
    // 显示loading图标
    $('#video-op-confirm .loading').show();
    switch (eventName) {
      case 'deleteComment':
        // 删除注释
        deleteComment();
      break;
      case 'rating':
        sendRating();
      break;
    }
  }

  $('.js-operate-confirm').on('click', function () {
    var eventName = $(this).parents('.operate').data('event-name');
    eventConfirm(eventName);
  });

  $('#video-op-confirm .js-operate-cancel').on('click', function () {
    confirmClose();
  });
  $('#info-modal .js-operate-cancel').on('click', function () {
    $(this).parents('.operate').removeClass('show');
    $('body .main-mask').remove();
  });

  function syncPlayerCurrentTime () {
    currentTimeInterval = setInterval(function () {
      commentVm.freshComment.timepoint = Math.round(player.currentTime);
    }, 1000);
  }

  function clearSyncPlayerCurrentTime () {
    clearInterval(currentTimeInterval);
  }

  function sendRatingRequest (projectId, assignmentId, rating, callback, errorHandle) {
    var url = '/assignments/' + assignmentId + '/rating';
    $.ajax({
      url: url,
      method: 'post',
      data: {
        project_id: projectId,
        rating: rating
      },
      success: function (data) {
        if(data.status === 0 && data.code === 1) {
          callback(data);
        } else {
          errorHandle();
        }
      },
      error: function (xhr, textStatus, errors) {
        Geeklab.showInfoModal('评分失败，请稍后重试');
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
    if(timepoint <= videoDuration) {
      player.currentTime = timepoint;
      player.play();
    }
  }

  function getFeedbacks (assignmentId, callback) {
    var url = '/assignments/' + assignmentId + '/feedbacks'
    $.ajax({
      url: url,
      success: function (data) {
        callback(data)
      },
      error: function (xhr, textStatus, errors) {
        callback();
        Geeklab.showInfoModal('获取注释失败');
      }
    });
  }

  function sendCreateCommentRequest (comment, callback, errorHandle) {
    var url = '/assignments/' + assignmentId + '/feedbacks';
    $.ajax({
      url: url,
      method: 'post',
      data: {
        feedback: comment
      },
      success: function (data) {
        if(data.status === 0 && data.code === 1) {
          callback(data.feedback);
        }
      },
      error: function (xhr, textStatus, errors) {
        Geeklab.showInfoModal('创建失败,请稍后重试');
        errorHandle();
      }
    });
  }

  function sendUpdateCommentRequest (comment, callback, errorHandle) {
    var url = '/assignments/' + assignmentId + '/feedbacks/' + comment.id;
    $.ajax({
      url: url,
      method: 'put',
      data: {
        feedback: comment
      },
      success: function (data) {
        if(data.status === 0 && data.code === 1) {
          callback();
        }
      },
      error: function (xhr, textStatus, errors) {
        Geeklab.showInfoModal('更新失败, 请稍后重试');
        errorHandle();
      }
    });
  }

  function sendDeleteCommentRequest (commentId, callback, errorHandle) {
    var url = '/assignments/' + assignmentId + '/feedbacks/' + commentId;
    $.ajax({
      url: url,
      method: 'delete',
      success: function (data) {
        if(data.status === 0 && data.code === 1) {
          callback();
        } else {
          errorHandle();
        }
      },
      error: function (xhr, textStatus, errors) {
        console.log(errors);
        errorHandle();
      }
    });
  }

  function initFreshComment (vm) {
    clearSyncPlayerCurrentTime();

    vm.freshComment.$set('timepoint', Math.floor(player.currentTime));
    vm.freshComment.$set('editing', true);
    if(vm.pause) {
      player.pause();
    }
  }

  function addComment (vm) {
    var freshComment = {
      timeline: vm.freshComment.timepoint,
      desc: vm.freshComment.desc
    };
    if(vm.freshComment.desc) {
      vm.freshComment.$set('saving', true);
      sendCreateCommentRequest(freshComment, function (feedback) {
        vm.comments.push(feedback);
        vm.editing.push(false);
        vm.saving.push(false);
        vm.freshComment.$set('saving', false);
        vm.freshComment.$set('editing', false);
        vm.freshComment.$set('desc', '');
        // 保存注释后自动开始播放视频
        if(player.paused) {
          player.play();
        } else {
          syncPlayerCurrentTime();
        }
      }, function () {
        vm.freshComment.$set('saving', false);
      });
    } else {
      Geeklab.showInfoModal('注释内容不能为空');
      return false;
    }
  }

  function cancelAddComment (vm) {
    vm.freshComment.$set('desc', '');
    vm.freshComment.$set('editing', false);
    syncPlayerCurrentTime();
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
      }, function () {
        vm.saving.$set(commentIndex, false)
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
    Geeklab.showConfirmModal({
      modal: '#video-op-confirm',
      eventName: 'deleteComment',
      content: '确定要删除注释"' + comment + '"'
    });
    vm.currCommentIndex = commentIndex;
  }

  function deleteComment () {
    var commentId = commentVm.comments[commentVm.currCommentIndex].id;
    sendDeleteCommentRequest (commentId, function () {
      commentVm.comments.$remove(commentVm.currCommentIndex);
      confirmClose();
    }, function () {
      showOpError('删除失败, 请稍后重试');
    });
  }

  // 初始化comment Vue 对象
  getFeedbacks(assignmentId, function (data) {
    var commentVmData = {
      pause: false,
      currCommentIndex: 0,
      freshComment: {
        timepoint: 0,
        desc: '',
        editing: false,
        saving: false
      },
      comments: data.feedbacks || [],
      editing: [],
      saving: []
    }

    for (var i = 0, len = commentVmData.comments.length; i < len; i++) {
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

    // 在添加注释的时间点上实时显示视频的播放时间
    $(player).on('play', function () {
      syncPlayerCurrentTime();
    });

    $(player).on('pause', function () {
      clearSyncPlayerCurrentTime();
    });

  });

});
