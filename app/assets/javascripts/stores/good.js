$(function () {
  if(!$('body').hasClass('goods_show')) {
    return false;
  }

  $('.exchange').on('click', function () {
    var price = $(this).data('price'),
        score = $(this).data('score');
    if(score < price) {
      $('#score-hint').modal();
      return false;
    } else {
      exchange();
    }
  });

  $('#login-hint .confirm').on('click', showSignModal);

  function exchange () {
    $('#exchange-success').modal();
    var counter = 4;
    var intervalId = setInterval(function () {
      $('#exchange-success .counter').text(counter--);
      if(counter === 0){
        location.href="/stores/orders/";
      }
    }, 1000);
    //$.ajax({
      //url: '',
      //method: 'post',
      //data: {}
    //})
    //.done(function (data) {
      //if(data.status === 0 && data.code === 1) {
        //// 兑换成功
        //$('#exchange-success').modal();
      //}
    //});
  }

  function showSignModal () {
    $('.modal.in').modal('hide');
    $('#sign').modal();
  }
})
