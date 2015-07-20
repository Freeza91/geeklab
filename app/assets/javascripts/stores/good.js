$(function () {
  if(!$('body').hasClass('goods_show')) {
    return false;
  }

  $('#login-hint .confirm').on('click', showSignModal);

  function showSignModal () {
    $('.modal.in').modal('hide');
    $('#sign').modal();
  }


  var goodVm = new Vue({
    el: '#good',
    data: {

    },
    methods: {
      toggleGallery: toggleGallery,
      exchange: exchange
    }
  });

  function toggleGallery (picUrl, event) {
    goodVm.galleryMain = picUrl;
    $('.good-selected').removeClass('good-selected');
    event.target.className += 'good-selected';
  }

  function exchange(id, price, score) {
    if(score < price) {
      $('#score-hint').modal();
      return false;
    } else {
      sendExchange(id);
    }
  }

  function sendExchange (goodId) {
    var order = {
      good_id: goodId
    };
    $.ajax({
      url: '/stores/orders',
      method: 'post',
      data: {order: order}
    })
    .done(function (data) {
      if(data.status === 0) {
        switch(data.code) {
          case 0:
            // 失败, Todo
            console.log('兑换失败');
          break;
          case 1:
            // 成功
            $('#exchange-success').modal();
            var counter = 4;
            var intervalId = setInterval(function () {
              $('#exchange-success .counter').text(counter--);
              if(counter === 0){
                location.href="/stores/orders/";
              }
            }, 1000);
          break;
          case 2:
            // 库存不足 Todo
            console.log('库存不足');
          break;
          case 3:
            // 积分不够
            $('#score-hint').modal();
          break;
        }
      }
    })
    .error(function (errors) {
      console.log(errors);
    });
  }
});
