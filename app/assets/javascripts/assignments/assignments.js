$(function () {
  if(!$('body').hasClass('assignments')) {
    return false;
  }
  // function list
    //上传视频
    //删除视频
    //覆盖重新上传
    //删除任务
    //获取任务详细信息
    //显示过期任务数
    //播放视频
    //任务倒计时
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
      console.log('start post block');
      var blockSize = 4 << 20,
          start = blockIndex * blockSize,
          end = Math.min(start + blockSize, that.fileSize);
          block = that.file.slice(start, end);
      console.log(start, end);

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
            //showUploadProgress(that.progressPercent);
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
      console.log(chunkLen, chunkIndex);
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
            //showUploadProgress(that.progressPercent);
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
          //showUploadProgress(100);
          if(data.status === 0) {
            switch(data.code) {
              case 0:
                // 上传失败
                that.errorHandle(data);
              break;
              case 1:
                // 上传成功
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

    this.upload = function (assignmentId, file, callback, errorHandle) {

      var blockSize = 4 << 20;
      that.file = file;
      that.fileSize = file.size;
      that.blockLen = Math.ceil(that.fileSize / blockSize);
      console.log(that.blockLen);

      that.fileLoaded = 0;
      that.progressPercent = 0;

      that.blockIndex = 0;
      that.httpCount = 0;
      that.ctxCount = 0;
      that.xhrArr = that.xhrArr || [];

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
  window.Geeklab.uploader = new QiniuChunkUpload();

  // 保存testId
  var testerId = $('.assignments-list').data('testerId');
  var assignmentId = 0; // 当前执行操作的任务id
  var page = 1 //分页获取任务列表
  var $curVideo; // 当前正在播放的video

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

  $('.load-more').on('click', 'button', function () {
    page++;
    getAssignmentPaging(page, function (data) {
      appendAssignments(data.assignments);
    });
  });


  // 上传视频按钮的click事件处理函数
  $('.js-video-upload').on('click', function () {
    // 选择文件
    $('#video').click();
  });

  // 取消上传
  $('.assignments-wrp').on('click', '.js-upload-cancel', function () {
    uploader.abort();
    $card.find('.operator.uploading').hide();

    // 恢复上传进度圆环
    $card.find('.progressCircle .inner').css({
      'transform': 'rotate(0)',
      '-o-transform': 'rotate(0)',
      '-moz-transform': 'rotate(0)',
      '-webkit-transform': 'rotate(0)'
    });

    var $image = $card.find('.content img');
    if($image.attr('src')) {
      $image.fadeIn();
      $card.find('.operator.wait-check').fadeIn();
      return false;
    }
    $card.find('.operator.wait-upload').fadeIn();
  });

  // 上传失败取消
  $('.assignments-wrp').on('click', '.js-reupload-cancel', function () {
    $card.find('.operator.upload-failed').hide();
    var $image = $card.find('.content img');
    if($image.attr('src')) {
      $image.fadeIn();
      $card.find('.operator.wait-check').fadeIn();
      return false;
    }
    $card.find('.operator.wait-upload').fadeIn();
  });

  // 开始上传视频
  //$('#video').on('change', function () {
    //// 清理task-guide
    //$('#close').click();
    //var file = $(this)[0].files[0];
    //if(file) {
      //// 判断所选文件的类型是否为video
      //if(file.type.split('/')[0] === 'video') {
        //// 清空input的value, 使再次选中同一视频时还能触发change事件
        //$(this).val('');

        //uploader.upload(assignmentId, file, function (data) {
          //// 上传成功后的回调
          //// 切换operator
          //$card.find('.operator.wait-check').fadeIn();
          //$card.find('.operator.uploading').fadeOut();
          //// 显示状态，并将状态置为wait_check
          //$card.find('.status').fadeIn().removeClass().addClass('status status_wait_check').find('p').text('等待审核');
          //// 恢复上传进度圆环
          //$card.find('.progressCircle .inner').css({
            //'transform': 'rotate(0)',
            //'-o-transform': 'rotate(0)',
            //'-moz-transform': 'rotate(0)',
            //'-webkit-transform': 'rotate(0)'
          //});
              //// 清除上传input框的值
          //delete $('#video')[0].files;
          //// 上传成功后跳转至正在进行中的任务页面
          //if(location.pathname.split('/').pop() === 'assignments') {
            //location.href = '/assignments/join';
          //}
        //}, function () {
          //// 上传出错
          //$card.find('.operator.uploading').hide();
          //$card.find('.operator.upload-failed').fadeIn();
          //// 恢复上传进度圆环
          //$card.find('.progressCircle .inner').css({
            //'transform': 'rotate(0)',
            //'-o-transform': 'rotate(0)',
            //'-moz-transform': 'rotate(0)',
            //'-webkit-transform': 'rotate(0)'
          //});
        //});
      //}
    //}
  //});

  // 删除任务按钮的click事件处理函数
  $('.assignments-wrp').on('click', '.assignment-del', function () {

    var $this = $(this);
    $card = $this.parents('.card');
    assignmentId = $card.data('assignmentId');

    var options = {
      title: '对任务不感兴趣?',
      content: '任务删除后将无法查看和恢复，确认删除任务?',
      eventName: 'deleteAssignment'
    };
    showInfoModal(options);
  });

  // 删除视频 click event
  $('.assignments-wrp').on('click', '.js-video-del', function () {

    var $this = $(this);
    $card = $this.parents('.card');
    assignmentId = $card.data('assignmentId');

    var options = {
      title: '确认删除视频?',
      content: '确认删除视频?',
      eventName: 'deleteVideo'
    };
    showInfoModal(options);
  });

  // 上传失败重新上传 click event
  $('.assignments-wrp').on('click', '.js-video-reupload', function () {
    // 显示该任务详情的最后一页
    $('.task-pagination').click();
    $('#assignment-detail').modal();
  });

  // 播放视频 click event
  $('.assignments-wrp').on('click', '.js-video-play', function () {
    var $this = $(this);

    $card = $this.parents('.card');
    assignmentId = $card.data('assignmentId');

    getAssignmentVideoUrl(testerId, assignmentId, function(video) {
      playVideo(video);
    })
  });

  // 关闭视频播放modal
  $('#video-player [data-dismiss="modal"]').on('click', function () {
    $curVideo.pause();
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
        // 成功获取token, 执行回调上传图片
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


  // 显示操作的提示信息
  /* @param options  Object 显示的提示信息
   * options.title  String 标题
   * options.content String 内容
   * options.eventName String 确认按钮将会触发的事件
   */
  function showInfoModal (options) {
    var $modal = $('#confirm-modal');
    $modal.data('eventName', options.eventName);
    $modal.find('.content').text(options.content);
    $('body').append('<div class="main-mask"></div>');
    $modal.addClass('show');
  }

  // 点击modal确认按钮的处理函数
  $('#confirm-modal #confirm').on('click', function () {
    var eventName = $('#confirm-modal').data('event-name');
    eventConfirm(eventName);
  });
  $('.js-operate-cancel').on('click', function () {
    $(this).parents('.operate').removeClass('show');
    $('body .main-mask').remove();
  });
  // 点击modal确认按钮时触发的事件
  function eventConfirm(eventName) {
    switch (eventName) {
      case 'reloadVideo':
        //重新上传
      break;
      case 'deleteVideo':
        // 删除视频
        deleteVideo(testerId, assignmentId, function (data) {
          console.log(data);
          $card.find('.operator.wait-check').fadeOut();
          $card.find('.operator.wait-upload').fadeIn();
          $card.find('img').removeAttr('src').hide();
          $card.find('.status').hide();
        });
      break;
      case 'deleteAssignment':
        // 删除任务
        console.log('xxx');
        deleteAssigment (testerId, assignmentId, function () {
          // 删除任务后的回调， 将当前卡片重页面上移除
          $card.remove();
        });
      break;
    }
    $('#confirm-modal').removeClass('show');
    $('body .main-mask').remove();
  }

  function getAssignmentDetail (testerId, assignmentId, callback){
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
  }

  function showAssignmentDetail (assignmentDetail) {
    assignmentDetailVm.project = assignmentDetail;
    assignmentDetailVm.taskLen = assignmentDetail.tasks.length;
    assignmentDetailVm.stepLen = assignmentDetailVm.taskLen + 6;
    $('#assignment-detail').modal();
  }

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
  function showUploadProgress (progressPercent) {
    var deg = progressPercent * 3.6;
    //var $progressCircle = $card.find('.progressCircle')
    var transform = '';
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


  // 获取生成二维码所需token
  function getQrcodeToken (assignmentId, callback) {
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

  // 二级导航初始化
  $('.nav-subtabs a').on('click', function () {
    var $this = $(this);
    var target = $this.data('target'),
        hash = $this.data('hash');
    $this.parents('ul').find('.active').removeClass('active');
    $this.addClass('active');
    $('.assignments-wrp.active').removeClass('active').hide();
    var isEmpty = $(target).find('.card').length === 0;
    toggleEmpty(isEmpty);
    $(target).fadeIn().addClass('active');
    location.hash = hash;
  });

  var hash = location.hash.substr(1),
      $subTab = $('[data-hash="]' + hash  + '"]'),
      $assignmentsWrp = $('#assignments-' + hash),
      isEmpty = ($assignmentsWrp.find('.assignment-item').length === 0);

  toggleEmpty(isEmpty);

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

  function toggleEmpty(isEmpty) {
    if(isEmpty) {
      $('main').addClass('empty');
    } else {
      $('main').removeClass('empty');
    }
  }

});
