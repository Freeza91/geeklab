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
              var qrcode = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + data.ticket;
            }, function (errors) {
              console.log(errors);
            })
          break;
          case -1:
            console.log('未实名认证');
          break;
          case -2:
            console.log('没有这个红包')
          break;
          case -3:
            console.log('积分不足')
          break;
          case -4:
            console.log('兑换失败')
          break;
        }
      }
    }, function (errors) {
      console.log(errors);
    });
  }

  $('#reward-submit').on('click', submit)
});
