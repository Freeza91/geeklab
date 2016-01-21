$(function () {
  if(!$('body').hasClass('rewards_index')) {
    return false;
  }

  function createReward (rewardID, callback, errorHandle) {
    $.ajax({
      url: '/users/reward_records',
      method: 'post',
      data: {id: rewardID},
      success: function (data) {
        callback(data);
      },
      error: function (xhr, textStatus, errors) {
        errorHandle(errors);
      }
    });
  }

  function fetchQrcodeTicket (recordID, callback, errorHandle) {

    $.ajax({
      url: '/users/reward_records/' + recordID,
      success:  function (data) {
        callback(data);
      },
      error: function (xhr, textStatus, errors) {
        errorHandle(errors);
      }
    });
  }

  function submit (evt) {
    evt.preventDefault();
    var reward = $('[name="reward"]:checked').val();
    if(!reward) {
      // 未选择兑换金额
      $('.reward-hint').fadeIn();
      return false
    }
    createReward (reward, function (data) {
      if(data.status === 0) {
        switch(data.code) {
          case 1:
            fetchQrcodeTicket(data.id, function (data) {
              if(data.status === 0) {
                switch (data.code) {
                  case 1:
                    var qrcode = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + data.ticket;
                    console.log(qrcode);
                    var $modal = $('#reward-qrcode');
                    $('body').append('<div class="main-mask" onclick="Geeklab.clearMask()"></div>')
                    $modal.find('img').attr('src', qrcode);
                    $modal.addClass('show');
                  break;
                  case -1:
                    Geeklab.showInfoModal('兑换成功, 获取二维码失败, 请稍后到红包记录中重试');
                  break;
                }
              }
            }, function (errors) {
              console.log(errors);
            });
          break;
          case -1:
            Geeklab.showInfoModal('兑换失败, 未实名认证');
          break;
          case -2:
            Geeklab.showInfoModal('兑换失败, 没有这个红包');
          break;
          case -3:
            Geeklab.showInfoModal('兑换失败, 你的积分不足');
          break;
          case -4:
            Geeklab.showInfoModal('兑换失败');
          break;
        }
      }
    }, function (errors) {
      console.log(errors);
    });
  }

  $('#reward-submit').on('click', submit)
  $('.js-operate-cancel').on('click', function () {
    Geeklab.clearMask();
  });
});
