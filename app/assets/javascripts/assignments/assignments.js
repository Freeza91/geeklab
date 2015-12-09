$(function () {
  if(!$('body').hasClass('assignments')) {
    return false;
  }
    // function list
    // 上传视频
    // 获取任务详细信息
    // 任务倒计时
    // 瀑布流加载
    // 任务引导的vue model

  // 七牛分片上传
  function QiniuChunkUpload () {
    var that = this,
        fileBlockArr = [],
        blockLen = 0,
        blockIndex = 0,
        httpCount = 0,
        ctxCount = 0, // 记录ctx数量, 调用makeFile的标志
        uploadToken = '',
        // 计算上传进度所需数据
        fileSize = 0,
        fileLoaded = 0,
        progressPercent = 0,
        // 存储xhr
        xhrArr = [];

    this.segmentFile = function (file, segmentSize) {
      var segmentSize = segmentSize,
          fileSize = file.size,
          segmentLen = Math.ceil(fileSize / segmentSize),
          segmentArr = [],
          start = 0,
          end = 0;
      for(var i = 0; i < segmentLen; i++) {
        start = i * segmentSize;
        end = Math.min(start + segmentSize, fileSize);
        segmentArr[i] = file.slice(start, end);
      }
      return segmentArr;
    }

    this.postBlock = function (blockIndex) {
      var blockSize = 4 << 20,
          start = blockIndex * blockSize,
          end = Math.min(start + blockSize, that.fileSize);
          block = that.file.slice(start, end);

      var chunkSize = 2 << 20,
          chunkArr = that.segmentFile(block, chunkSize),
          chunkLen = chunkArr.length,
          chunkIndex = 0;

      // 存储xhr, 取消上传时调用
      var xhrIndex = blockIndex % 5;
      that.makeBlock(chunkArr[chunkIndex], block.size, xhrIndex, function (data) {

        chunkIndex = chunkIndex + 1;
        if(chunkIndex < chunkLen) {
          // block中含有多个chunk
          that.postChunkQueue(chunkArr, chunkIndex, data.host, data.ctx, data.offset, blockIndex)
        } else {
          // block只有一个chunk, 记录ctx
          that.ctx = that.ctx || [];
          that.ctx[blockIndex] = data.ctx;
          that.ctxCount = that.ctxCount + 1;
          // 所有块上传完成之后makefile
          if(that.ctxCount === that.blockLen) {
            that.makeFile(that.fileSize, that.ctx, data.host);
          }
        }
      });
    }

    this.makeBlock = function (firstChunk, blockSize, xhrIndex, callback) {
      var size = firstChunk.size,
          authorization = 'UpToken ' + that.uploadToken;

      $.ajax({
        url: 'http://upload.qiniu.com/mkblk/' + blockSize,
        method: 'post',
        data: firstChunk,
        cache: false,
        processData: false, //Dont't process the file
        contentType: false,
        tryCount: 0,
        retryLimit: 3,
        success: function (data) {
          if(!data.error) {
            that.fileLoaded = that.fileLoaded + firstChunk.size;
            that.progressPercent = Math.floor((that.fileLoaded / that.fileSize) * 95);
            that.onProgress(that.progressPercent);
            callback(data);
          }
        },
        error: function (xhr, textStatus, errors) {
          if(textStatus === 'abort') {
            return false;
          }
          this.tryCount = this.tryCount + 1;
          if(this.tryCount < this.retryLimit) {
            $.ajax(this);
            return;
          } else {
            that.fail();
            return;
          }
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
          xhr.setRequestHeader('Authorization', authorization);
          that.xhrArr[xhrIndex] = xhr;
        }
      });
    }

    this.postChunkQueue = function (chunkArr, chunkIndex, uploadHost, ctx, offset, blockIndex) {
      var chunkLen = chunkArr.length;
      var xhrIndex = blockIndex % 5;
      that.postChunk(chunkArr[chunkIndex], uploadHost, ctx, offset, xhrIndex, function (data) {
        if(chunkIndex === chunkLen - 1) {
          // 开始一个新的postBlock
          that.httpCount = that.httpCount - 1;
          if(that.blockIndex < that.blockLen) {
            that.httpCount = that.httpCount + 1;
            that.postBlock(that.blockIndex);
            that.blockIndex = that.blockIndex + 1;
          }

          // 记录最后一片的ctx
          that.ctx = that.ctx || [];
          that.ctx[blockIndex] = data.ctx;
          that.ctxCount = that.ctxCount + 1;
          // 所有块上传完成之后makefile
          if(that.ctxCount === that.blockLen) {
            that.makeFile(that.fileSize, that.ctx, data.host);
          }
        } else {
          // 上传下一片
          chunkIndex = chunkIndex + 1;
          that.postChunkQueue(chunkArr, chunkIndex, data.host, data.ctx, data.offset, blockIndex)
        }
      });
    }

    this.postChunk = function (chunk, uploadHost, ctx, chunkOffset, xhrIndex, callback) {

      var authorization = 'UpToken ' + that.uploadToken;

      $.ajax({
        url: uploadHost + '/bput/' + ctx + '/' + chunkOffset,
        method: 'post',
        data: chunk,
        cache: false,
        processData: false, //Dont't process the file
        contentType: false,
        tryCount: 0,
        retryLimit: 3,
        success: function (data) {
          if(!data.error) {
            that.fileLoaded = that.fileLoaded + chunk.size;
            that.progressPercent = Math.floor((that.fileLoaded / that.fileSize) * 95)
            that.onProgress(that.progressPercent);
            callback(data);
          }
        },
        error: function (xhr, textStatus, errors) {
          if(textStatus === 'abort') {
            return false;
          }
          this.tryCount = this.tryCount + 1;
          if(this.tryCount < this.retryLimit) {
            $.ajax(this);
            return;
          } else {
            that.fail();
            return;
          }
          if(xhr.status === 500) {
            // error handle
          } else {
            // error handle
          }
        },
        beforeSend: function (xhr){
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
          xhr.setRequestHeader('Authorization', authorization);
          that.xhrArr[xhrIndex] = xhr;
        }
      });
    }

    this.makeFile = function (fileSize, ctx, uploadHost) {

      var authorization = 'UpToken ' + that.uploadToken;
      $.ajax({
        url: uploadHost + '/mkfile/' + fileSize,
        method: 'post',
        data: that.ctx.join(','),
        tryCount: 0,
        retryLimit: 3,
        success: function (data) {
          if(data.status === 0) {
            switch(data.code) {
              case 0:
                // 上传失败
                that.errorHandle(data);
              break;
              case 1:
                // 上传成功
                that.progressPercent = 100;
                that.onProgress(that.progressPercent);
                that.callback(data);
              break;
            }
          }
        },
        error: function (xhr, textStatus, errors) {
          if(textStatus === 'abort') {
            return false;
          }
          this.tryCount = this.tryCount + 1;
          if(this.tryCount < this.retryLimit) {
            $.ajax(this);
            return;
          } else {
            that.fail();
            return;
          }
        },
        beforeSend: function (xhr){
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
          xhr.setRequestHeader('Authorization', authorization);
          that.xhrArr[5] = xhr;
        }
      });
    }

    this.upload = function (assignmentId, file, onProgress, callback, errorHandle) {

      var blockSize = 4 << 20;
      that.file = file;
      that.fileSize = file.size;
      that.blockLen = Math.ceil(that.fileSize / blockSize);

      that.fileLoaded = 0;
      that.progressPercent = 0;

      that.blockIndex = 0;
      that.httpCount = 0;
      that.ctxCount = 0;
      that.xhrArr = that.xhrArr || [];

      that.onProgress = onProgress;
      that.callback = callback;
      that.errorHandle = errorHandle;

      getUploadToken(assignmentId, file.name, function (token) {
        that.uploadToken = token;
        while(that.blockIndex < 5) {
          that.httpCount = that.httpCount + 1;
          that.postBlock(that.blockIndex);
          that.blockIndex = that.blockIndex + 1;
        }
      });
    }

    this.abort = function () {
      for(var i = 0, len = that.xhrArr.length; i < len; i++) {
        that.xhrArr[i].abort();
      }
    }

    this.fail = function () {
      this.abort();
      this.errorHandle();
    }
  }

  window.Geeklab = window.Geeklab || {};

  Geeklab.testerId = $('#tester-id').val();
  Geeklab.uploader = new QiniuChunkUpload();

  //生成一个qrcode实例
  Geeklab.qrcode = new QRCode($('#upload-qrcode')[0], {
    text: 'http://www.geeklab.cc',
    width: 120,
    height: 120,
  });

  // 发送抢任务请求
  Geeklab.sendOrderAssignmentRequest = function (assignmentId, callback) {
    $.ajax({
      url: '/assignments/' + assignmentId + '/got_it',
      success: function (data) {
        callback(data);
      },
      error: function (xhr, textStatus, errors) {
        console.log(errors);
      }
    });
  }

  // 发送订阅任务提醒请求
  Geeklab.sendSubscribeRequest = function (assignmentId, callback) {
    $.ajax({
      url: '/assignments/' + assignmentId + '/subscribe',
      success: function (data) {
        callback(data);
      },
      error: function (xhr, textStatus, errors) {
        console.log(errors);
      }
    });
  }

  // 发送取消任务提醒订阅请求
  Geeklab.sendUnsubscribeRequest = function (assignmentId, callback) {
    $.ajax({
      url: '/assignments/' + assignmentId + '/unsubscribe',
      success: function (data) {
        callback(data);
      },
      error: function (xhr, textStatus, errors) {
        console.log(errors);
      }
    });
  }

  // 抢任务
  Geeklab.orderAssignment = function (assignment) {
    var assignmentId = assignment.id;
    Geeklab.sendOrderAssignmentRequest(assignmentId, function (data) {
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
  // 订阅提醒
  Geeklab.subscribeAssignment = function (assignment) {
    var assignmentId = assignment.id;
    Geeklab.sendSubscribeRequest(assignmentId, function (data) {
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

  // 取消订阅
  Geeklab.unsubscribeAssignment = function (assignment) {
    var assignmentId = assignment.id;
    Geeklab.sendUnsubscribeRequest (assignmentId, function (data) {
      switch(data.code) {
        case 1:
          // 取消订阅成功
          alert('取消订阅成功');
          assignment.subscribe = false;
        break;
        case 2:
          // 已经取消订阅过
          alert('还没有订阅过')
        break
      }
    });
  }

  // 获取assignments分页数据
  Geeklab.fetchAssignmentPaging = function (type, page, callback) {
    var url = '/assignments/' + type;
    $.ajax({
      url: url,
      data: {page: page},
      datatype: 'json',
      success: function (data, status) {
        if(data.status === 0 && data.code === 1) {
          callback(data.assignments);
        }
      },
      errror: function (xhr, textstatus, errors) {
        console.log(errors);
      }
    });
  }

  // 加载assignments下一页
  Geeklab.loadNextPage = function (vm) {
    var type = vm.type,
        page = vm.page + 1;
    Geeklab.fetchAssignmentPaging(type, page, function (assignments) {
      if(assignments.length > 0) {
        vm.assignments = vm.assignments.concat(assignments);
        vm.page = vm.page + 1;
      }
      if(assignments.length < 10) {
        vm.isAll = true;
      }
    });
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
      getAssignmentPaging(page, function (data) {
        appendAssignments(data.assignments);
      });
    }
  });

  // 上传视频按钮的click事件处理函数
  $('.js-video-upload').on('click', function () {
    // 选择文件
    $('#video').click();
  });

  // 获取上传视屏的token
  function getUploadToken(assignmentId, filename, callback) {
    var url = '/assignments/upload_token/';
    $.ajax({
      url: url,
      data: {
        name: filename,
        assignment_id: assignmentId
      }
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        // 成功获取token, 执行回调上传视频
        var token = data.token;
        callback(token);
      } else {
        alert('获取token失败');
      }
    })
    .error(function(errors, status) {
      console.log(errors);
    })
  }


  // 显示操作确认的提示信息
  /* @param options  Object 显示的提示信息
   * options.title  String 标题
   * options.content String 内容
   * options.eventName String 确认按钮将会触发的事件
   */
  Geeklab.showConfirmModal = function (options) {
    var $modal = $('#confirm-modal');
    $modal.data('eventName', options.eventName);
    $modal.find('.content').text(options.content);
    $('body').append('<div class="main-mask"></div>');
    $modal.addClass('show');
  }

  $('.js-operate-cancel').on('click', function () {
    $(this).parents('.operate').removeClass('show');
    $('body .main-mask').remove();
  });

  // 获取任务详情
  Geeklab. fetchAssignmentDetail = function (testerId, assignmentId, callback) {
    var url = '/assignments/' + assignmentId;
    $.ajax({
      url: url,
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        callback(data.project);
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    })
  };

  // 获取生成二维码所需token
  Geeklab. fetchQrcodeToken = function (assignmentId, callback) {
    var url = "/assignments/qr_token";
    $.ajax({
      url: url,
      data: {
        assignment_id: assignmentId
      }
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        callback(data.auth_token)
      }
    })
    .error(function (errors) {
      console.log('获取qrtoken失败');
    });
  }

  Geeklab.startAssignment = function (vm, assignment, event, index) {
    Geeklab.showLoading();
    var assignmentId = assignment.id;
    assignmentDetailVm.id = assignmentId;
    vm.currAssignIndex = index;
    vm.currAssign = $(event.target).parents('.assignment-item');
    Geeklab.fetchAssignmentDetail(Geeklab.testerId, assignmentId, function (project) {
      // 任务为手机应用时生成二维码
      if(assignment.device !== 'web') {
        Geeklab.fetchQrcodeToken(assignmentId, function (token) {
          var uploadUrl = location.origin
                        + "/assignments/upload?"
                        + "auth_token="
                        + token
                        + "&id="
                        + assignmentId;
          Geeklab.qrcode.clear();
          Geeklab.qrcode.makeCode(uploadUrl);
        });
      }

      // 赋值数据给assignmentDetailVm
      assignmentDetailVm.project = project;
      assignmentDetailVm.taskLen = project.tasks.length;
      assignmentDetailVm.stepLen = project.tasks.length + 6;
      setTimeout(function () {
        Geeklab.removeLoading();
        $('#assignment-detail').modal();
      }, 1000);
    });
  }


  function prevStep (vm) {
    vm.curStepIndex -= 1;
    switch(vm.progress) {
      case 'prepare':
        vm.progress = 'requirement';
        vm.nextStepText = '好的';
      break;
      case 'help':
        vm.progress = 'prepare';
        vm.nextStepText = '好了';
      break;
      case 'hint':
        vm.progress = 'help';
        vm.nextStepText = '开始任务';
      break;
      case 'situation':
        vm.progress = 'hint';
        vm.nextStepText = '接下来 →';
      break;
      case 'work-on':
      if(vm.curStepIndex === 5) {
        vm.curStepContent = vm.project.desc;
        vm.progress = 'situation';
      } else {
        vm.curStepContent = vm.project.tasks[vm.curStepIndex - 6].content;
      }
      break;
      case 'work-done':
        vm.curStepContent = vm.project.tasks[vm.curStepIndex - 6].content;
        vm.progress = 'work-on';
        vm.nextStepText = '接下来 →';
      break;
    }
  }

  function nextStep (vm) {
    vm.curStepIndex += 1;
    switch(vm.progress) {
      case 'requirement':
        vm.progress = 'prepare';
        vm.nextStepText = '好了';
      break;
      case 'prepare':
        vm.progress = 'help';
        vm.nextStepText = '开始任务';
      break;
      case 'help':
        vm.progress = 'hint';
        vm.nextStepText = '接下来 →';
      break;
      case 'hint':
        vm.progress = 'situation';
        vm.curStepContent = vm.project.desc;
        vm.nextStepText = '接下来 →';
      break;
      case 'situation':
        vm.progress = 'work-on';
        vm.curStepContent = vm.project.tasks[0].content;
      break;
      case 'work-on':
      if(vm.curStepIndex - 6 === vm.taskLen) {
        vm.progress = 'work-done';
      } else {
        vm.curStepContent = vm.project.tasks[vm.curStepIndex - 6].content;
      }
      break;
    }
  }

  function lastStep (vm) {
    vm.$set('progress', 'work-done');
    vm.$set('curStepIndex', vm.stepLen);
  }

  function close(vm) {
    $('#assignment-detail').modal('hide');
    vm.$set('curStepIndex', 1);
    vm.$set('progress', 'requirement');
  }

  function refreshQrImage (vm, event) {
    var $target = $(event.target);
    if($target.hasClass('disable')) {
      return false;
    }
    $target.addClass('disable');
    var $qrcode = $('#upload-qrcode');
    Geeklab.qrcode.clear();
    $qrcode.find('.fa-refresh').addClass('fa-spin');
    $qrcode.find('.img-mask').css({
      display: 'block'
    });
    Geeklab.fetchQrcodeToken(vm.id, function (token) {
      var uploadUrl = location.origin
                    + "/assignments/upload?"
                    + "auth_token="
                    + token
                    + "&id="
                    + vm.id;
      setTimeout(function () {
        Geeklab.qrcode.makeCode(uploadUrl);
        $qrcode.find('.fa-refresh').removeClass('fa-spin');
        $qrcode.find('.img-mask').removeAttr('style');
        $target.removeClass('disable');
      }, 1000)
    });
  }

  function mapDevice (platform, device) {
    if(device === 'web') {
      return '电脑'
    }
    var map = {
      'iospad': 'iPad',
      'iosphone': 'iPhone',
      'androidphone': 'Android Phone',
      'androidpad': 'Android Pad',
    }
    return map[platform + device];
  }

   var assignmentDetailVm = new Vue({
    el: '#assignment-detail',
    data: {
      id: '',
      progress: 'requirement',
      curStepContent: '',
      curStepIndex: 1,
      stepLen: 0,
      taskLen: 0,
      project: {},
      nextStepText: '好的',
      uplodging: false
    },
    methods: {
      prev: prevStep,
      next: nextStep,
      lastStep: lastStep,
      refreshQrImage: refreshQrImage,
      mapDevice: mapDevice,
      close: close
    }
  });

  // 任务过期时间倒计时
  //var countDownInterval = []; // 倒计时interval id list
  //var assignmentDeadline = []; // 任务截止事时间
  // 处理新加载任务的倒计时
  // 每次新加载时候清理之前所有的倒计时，重新初始化
  // 处理方式太暴力了，以后优化
  //function assignmentTimeCountDownInit () {
    //var max_times = 1000 * 60 * 60 * 24 * 100;
    //$('.time').each(function (index, item) {
      ////countDownInterval[index] = setInterval(assignmentTimeCountDown(deadline, $ele));
      //var $ele = $(item),
          //// 兼容safari Date对象
          //deadline = $ele.attr('data-deadline').replace(/-/g, '/');
          //now = new Date();

      //assignmentDeadline[index] = new Date(deadline);
      //var times = assignmentDeadline[index] - now;
      //if(times <= 0 || times > max_times) {
        //return false;
      //}

      //assignmentTimeCountDown(times, $ele);

      //// 周期执行倒计时函数，周期为1s
      //countDownInterval[index] = setInterval(function () {
        //var deadline = assignmentDeadline[index],
            //now = new Date(),
            //times = deadline - now;
        //if(times <= 0) {
          //clearInterval(countDownInterval[index]);
          //return false;
        //}
        //assignmentTimeCountDown(times, $ele);
      //}, 1000);
    //});
  //}

  //function assignmentTimeCountDown(count, $ele) {
    //var timeArr = [];
    //if(count > 24 * 60 * 60 * 1000) {
      //var days = ~~ (count / (24 * 60 * 60 * 1000));
      //days = days < 10 ? '0' + days : days;
      //timeArr.push(days + '天');
    //}
    //if(count > 60 * 60 * 1000) {
      //var hours = ~~ ((count / (60 * 60 * 1000)) % 24);
      //hours = hours < 10 ? '0' + hours : hours;
      //timeArr.push(hours + '时');
    //}
    //if(count > 60 * 1000) {
      //var minutes = ~~ ((count / (60 * 1000)) % 60);
      //minutes = minutes < 10 ? '0' + minutes : minutes;
      //timeArr.push( minutes + '分');
    //}
    //if(count > 1000) {
      //var seconds = ~~ ((count / 1000) % 60);
      //seconds = seconds < 10 ? '0' + seconds : seconds
      //timeArr.push(seconds + '秒');
    //}
    //$ele.text(timeArr.join(''));
  //}

  // 倒计时初始化
  //assignmentTimeCountDownInit();

  // 显示上传进度
  Geeklab.showUploadProgress = function (progressPercent, $progressCircle) {
    var deg = progressPercent * 3.6,
        transform = '';
    if(deg <= 180) {
      transform = 'rotate(' + deg + 'deg)';
      $progressCircle.find('.right .inner').css({
        'transform': transform,
        '-o-transform': transform,
        '-moz-transform': transform,
        '-webkit-transform': transform
      });
    } else {
      transform = 'rotate(' + (deg-180) + 'deg)';
      $progressCircle.find('.right .inner').css({
        'transform': 'rotate(180deg)',
        '-o-transform': 'rotate(180deg)',
        '-moz-transform': 'rotate(180deg)',
        '-webkit-transform': 'rotate(180deg)'
      });
      $progressCircle.find('.left .inner').css({
        'transform': transform,
        '-o-transform': transform,
        '-moz-transform': transform,
        '-webkit-transform': transform
      });
    }
    $progressCircle.find('.progressCount').text(progressPercent + '%');
  }

  Geeklab.clearUploadProgresss = function ($progressCircle) {
    $progressCircle.find('.inner').css({
      'transform': 'rotate(0)',
      '-o-transform': 'rotate(0)',
      '-moz-transform': 'rotate(0)',
      '-webkit-transform': 'rotate(0)'
    });
    $progressCircle.find('.progressCount').text('0%');
  }

  // 二级导航初始化
  $('.nav-subtabs a').on('click', function () {
    var $this = $(this);
    var target = $this.data('target'),
        hash = $this.data('hash');
    $this.parents('ul').find('.active').removeClass('active');
    $this.addClass('active');
    $('.assignments-wrp.active').removeClass('active').hide();
    $(target).fadeIn().addClass('active');
    location.hash = hash;
  });

  var hash = location.hash.substr(1);
  if(location.pathname === '/assignments') {
    location.hash = 'fresh';
  } else {
    if(hash === 'done') {
      location.hash = 'done';
      $('[data-hash="done"]').click();
    } else {
      location.hash = 'ing';
    }
  }

  function setAssignmentsMinHeight () {
    var height = document.documentElement.clientHeight - 50 - 160 - 117;
    $('.assignments-wrp').css({
      'min-height': height + 'px'
    });
  }
  setAssignmentsMinHeight();

});
