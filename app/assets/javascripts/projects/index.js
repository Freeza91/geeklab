$(function () {
  if(!$('body').hasClass('projects_index')) {
    return false;
  }

  var id,
      $card,
      page = 1;

  var statusMap = {
    'underway': '正在进行中',
    'wait_check': '等待审核',
    'checking': '正在审核',
    'not_accept': '审核未通过',
    'success': '任务成功',
    'failed': '任务失败'
  };
  $('.projects-wrp').on('click', '.delete-project', function () {
    $card = $(this).parents('.card');
    id = $(this).parents('.card').data('projectId');

    var $modal = $('#confirm-modal');
    $modal.data('eventName', 'deleteProject');
    $modal.find('.modal-body .content').text('确认删除任务?');
    $modal.modal();
  });

  $('#confirm-modal #confirm').on('click', function () {
    $('#confirm-modal').modal('hide');
    var url = '/projects/' + id;
    $.ajax({
      url: url,
      method: 'delete'
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        $card.remove();
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });
  });

  // 瀑布流加载，监听window滚动事件
  $(window).on('scroll', function () {
    // 第一页数量小于10
    if(!!$('.load-more p')){
      $(window).unbind('scroll');
      return false;
    }
    // 页面高度
    var pageHeight = $(document).height();
    // 视窗高度
    var viewHeight = $(window).height();
    // 滚动高度
    var scrollTop = $(window).scrollTop();
     //滚动到底部时自动加载新任务
    if((viewHeight + scrollTop) > (pageHeight - 10)) {
      // 页数自增
      page++;
      getProjectPaging(page, function (data) {
        appendProjects(data);
      });
    }
  });

  $('.load-more').on('click', 'button', function () {
    page++;
    getProjectPaging(page, function (data) {
      appendProjects(data);
    });
  });
  
  function getProjectPaging (page, callback) {
    $.ajax({
      url: '/projects',
      data: {page: page},
      dataType: 'json'
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        if(data.projects.length != 0) {
          callback(data);
        }
        if(data.projects.length < 10) {
          $(window).unbind('scroll');
          $('.load-more').unbind('click').find('button').hide();
          $('.load-more').append('<p>没有更多了</p>');
        }
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });
  }

  function appendProjects (data) {
    var projects = data.projects,
        assignments = data.assignments;
    var $projectsWrp = $('.projects-wrp');
    var $projectCard = $('.card:last').clone();
    var cards = [];

    for(var i = 0; i < projects.length; i++) {
      // name
      $projectCard.find('.title sapn:first').text(projects[i].name)
      // status
      $projectCard.find('.status').removeClass().addClass('status status_' + projects[i].status).find('span').text(statusMap[projects[i].status]);
      // 完成进度
      $projectCard.find('.progress-num .done').text(assignments[i].length);
      $projectCard.find('.progress-num .total').text('/' + projects[i].demand);
     
      // 视频截图
      var $video = $projectCard.find('.videos ul');
      var videoTemplate = $video.children().last();
      if(videoTemplate.find('img').length === 0) {
        videoTemplate.prepend('<img>');
      }
      $video.empty();
      assignments[i].forEach(function (assignment) {
        var video = videoTemplate.clone();
        video.find('img')[0].src =  assignment.video + '?vframe/png/offset/0/w/480/h/200';
        video.find('a')[0].href = '/projects/' + projects[i].id + '/video/' + assignment.id;
        $video.append(video);
      });
      videoTemplate.find('img').remove();
      for(var j = 0, len = projects[i].demand-assignments[i].length; j < len; j++) {
        $video.append(videoTemplate.clone());
      }

      // deadline
      $projectCard.find('.count-down').data('deadline', projects[i].expired_at);

      // 将每个任务的html暂存在数组中
      cards.push('<div class="card">' + $projectCard.html() + '</div>');
    }
    $projectsWrp.append(cards.join(''));
 
    // 重新初始化倒计时
    countDownInterval.forEach(function (id, index) {
      clearInterval(id);
    })
    timeCountDownInit();
  }

  // 倒计时
  var countDownInterval = [];
  var projectDeadline = [];
  function countDownInit () {
    $('.count-down').each(function (index, item) {
      var $ele = $(item),
          deadline = $ele.data('deadline'),
          now = new Date();
      console.log(deadline);
      projectDeadline[index] = new Date(deadline);
      var times = projectDeadline[index] - now;

      if(times > 0) {

        countDown(times, $ele);

        countDownInterval[index] = setInterval(function () {
          var deadline = projectDeadline[index],
              now = new Date(),
              times = deadline - now;
          if(times <= 0) {
            clearInterval(countDownInterval[index]);
            return false;
          }
          countDown(times, $ele);
        }, 1000 * 60);
      }
    });
  }

  function countDown (count, $ele) {
    var days = ~~ (count / (24 * 60 * 60 * 1000)), //天
        hours = ~~ ((count / (60 * 60 * 1000)) % 24), //小时
        minutes = ~~ ((count / (60 * 1000)) % 60), //分钟
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    $ele.find('.day').text(days);
    $ele.find('.hour').text(hours);
    $ele.find('.minute').text(minutes);
  }

  // 倒计时初始化
  countDownInit();

  // 计算comment的位置
  function caculateCommentPosition () {
    var comments = $('.comment');
    comments.each(function (index, comment) {
      var $comment = $(comment),
          $status = $comment.parent().find('.status');
      var statusPosition = $status.position();
      var left = statusPosition.left + $status.width() + 10,
          topPosition = ($comment.height() / 2) - statusPosition.top - 7;
      $comment.css({
        'top': '-' + topPosition + 'px',
        'left': left + 'px'
      });
    });
  }

  caculateCommentPosition();

  // 显示comment, 当鼠标移到状态栏图标上时
  $('.projects-wrp').on('mouseenter', '.status', function (){
    console.log('xxx');
    $(this).parents('.title').find('.comment').fadeIn();
  });
  $('.projects-wrp').on('mouseout', '.status', function (){
    $(this).parents('.title').find('.comment').fadeOut();
  });

});