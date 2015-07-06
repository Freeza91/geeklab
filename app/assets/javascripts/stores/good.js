$(function () {
  if(!$('body').hasClass('goods_show')) {
    return false;
  }

  $('.exchange').on('click', function () {
    var price = $(this).data('price'),
        score = $(this).data('score'),
        id = $(this).data('id');
    if(score < price) {
      $('#score-hint').modal();
      return false;
    } else {
      exchange(id);
    }
  });

  $('#login-hint .confirm').on('click', showSignModal);

  function exchange (goodId) {
    var order = {
      good_id: parseInt(goodId)
    };
    $.ajax({
      url: '/stores/orders',
      method: 'post',
      data: {order: order}
    })
    .done(function (data) {
      if(data.status === 0 && data.code === 1) {
        // 兑换成功
        $('#exchange-success').modal();
        var counter = 4;
        var intervalId = setInterval(function () {
          $('#exchange-success .counter').text(counter--);
          if(counter === 0){
            location.href="/stores/orders/";
          }
        }, 1000);
      }
    })
    .error(function (errors) {
      console.log(errors);
    });
  }

  function showSignModal () {
    $('.modal.in').modal('hide');
    $('#sign').modal();
  }
})
