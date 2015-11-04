$(function () {
  if(!$('body').hasClass('projects_index')) {
    return false;
  }

  var id,
      $card;

  $('#confirm').on('click', function () {
    var eventName = $('#confirm-modal').data('event-name');
    switch (eventName) {
      case 'deleteProject':
        deleteProject();
      break;
    }
    confirmClose();
  });

  $('#confirm-modal .js-operate-cancel').on('click', confirmClose);

  function confirmClose() {
    $('#confirm-modal').removeClass('show');
    $('body .main-mask').remove();
  }

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
          callback(data.projects);
        }
        if(data.projects.length < 10) {
          $(window).unbind('scroll');
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
      $projectCard.find('.title a').text(projects[i].name)
      $projectCard.find('.title a').attr('href', '/projects/' + projects[i].id);
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

  }

  // project card show & hide toggle
  function showProjectBody(event) {
    var $target = $(event.target);
    $target.parents('.project-item').find('.item-body').slideDown(600);
    $target.hide();
    $target.parent().children('.fa-angle-up').show();
  }
  function hideProjectBody(event) {
    var $target = $(event.target);
    $target.parents('.project-item').find('.item-body').slideUp(600);
    $target.hide();
    $target.parent().children('.fa-angle-down').show();
  }

  function sentDeleteProjectRequest (id, callback) {
    var url = '/projects/' + id;
    $.ajax({
      url: url,
      method: 'delete'
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        callback();
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });
  }

  function showDeleteConfirm (index) {
    var $modal = $('#confirm-modal');
    $modal.data('eventName', 'deleteProject');
    $modal.find('.content').text('确认删除任务?');
    $('body').append('<div class="main-mask"></div>')
    $modal.addClass('show');

    projectList.currProjectId = projectList.projects[index].id;
    projectList.currProjectIndex = index;
  }

  function deleteProject () {
    sentDeleteProjectRequest (projectList.currProjectId, function () {
      projectList.projects.$remove(projectList.currProjectIndex);
    });
  }

  function toggleItemBodyContent (event) {
    var $target = $(event.target),
        selector = $target.data('target');
    $target.parents('.item-body').find('a.active').removeClass('active');
    $target.addClass('active');
    $target.parents('.item-body').children('.active').hide().removeClass('active');
    $target.parents('.item-body').find(selector).fadeIn().addClass('active');
  }

  function isProjectEditable (status) {
    return status === 'wait_check' || status === 'not_accept';
  }

  function canBeDeleted (status) {
    return status !== 'underway' && status !== 'success';
  }

  function canShowCountDown (project) {
    var isRightStatus = (project.status === 'underway' || project.status === 'success');
    return isRightStatus && project.deadline;
  }

  function getStatusMap (status) {
    var statusMap = {
      'underway': '正在进行中',
      'wait_check': '等待审核',
      'checking': '正在审核',
      'not_accept': '审核未通过',
      'success': '审核成功',
      'failed': '任务过期'
    };
    return statusMap[status];
  }

  function getCityMap (cityLevel) {
    var cityMap = {
      '1': '北上广深',
      '2': '省会城市',
      '3': '其它'
    };
    for(var i = 0, len = cityLevel.length; i < len; i++) {
      cityLevel[i] = cityMap[cityLevel[i]];
    }
    return cityLevel;
  }


  var projectList = new Vue({
    el: '#project-list',
    data: {
      page: 1,
      currProjectId: 0,
      projects: []
    },
    methods: {
      editable: isProjectEditable,
      canBeDeleted: canBeDeleted,
      canShowCountDown: canShowCountDown,
      getStatusMap: getStatusMap,
      getCityMap: getCityMap,
      showProjectBody: showProjectBody,
      hideProjectBody: hideProjectBody,
      toggleItemBodyContent: toggleItemBodyContent,
      showDeleteConfirm: showDeleteConfirm,
      deleteProject: deleteProject
    }
  });

  getProjectPaging(1, function(projects) {
    // 初始化倒计时
    var count = 0,
        day = 0,
        hour = 0,
        minute = 0;
    for(var i = 0, len = projects.length; i < len; i++) {
      count = new Date(projects[i].expired_at) - new Date();
      if(count > 0) {
        projects[i].deadline = [];

        days = ~~ (count / (24 * 60 * 60 * 1000)), //天
        hours = ~~ ((count / (60 * 60 * 1000)) % 24), //小时
        minutes = ~~ ((count / (60 * 1000)) % 60), //分钟

        projects[i].deadline[0] = days < 10 ? '0' + days : days;
        projects[i].deadline[1] = hours < 10 ? '0' + hours : hours;
        projects[i].deadline[2] = minutes < 10 ? '0' + minutes : minutes;
      }
    }

    // 全量更新projectList.$data.projects
    projectList.projects = projects;

    // 倒计时更新
    setInterval(function () {
      var deadline,
          day,
          hour,
          minute;
      for(var i = 0, len = projectList.projects.length; i < len; i++) {
        deadline = projectList.projects[i].deadline;
        if(deadline && deadline.join('') > 0) {
          day = parseInt(deadline[0]);
          hour = parseInt(deadline[1]);
          minute = parseInt(deadline[2]);

          if(minute > 0) {
            minute = minute -1;
            minute = minute < 10 ? '0' + minute : minute;
            deadline.$set(2, minute);
          } else {
            if (day > 0 || hour > 0) {
              deadline.$set(2, 59);
            }
            if (hour > 0) {
              hour = hour -1;
              hour = hour < 10 ? '0' + hour : hour;
              deadline.$set(1, hour);
            } else {
              if (day > 0) {
                day = day - 1;
                day = day < 10 ? '0' + day : day;
                deadline.$set(1, 23);
                deadline.$set(0, day);
              }
            }
          }
        }
      }
    }, 1000 * 60)

  });

});
