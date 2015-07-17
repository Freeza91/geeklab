$(function () {
  if(!$('body').hasClass('orders_index')) {
    return false;
  }
  var $curOrder,
      orderId;
  
  $('.order-item .delete').on('click', function () {
    $curOrder = $(this).parents('.order-item');
    orderId = $curOrder.data('id');
    $('#order-delete').modal();
  });

  $('.order-item .detail').on('click', function () {
    var id = $(this).data('id');
    //var id = 2;
    getCardInfo(id, showCardInfo);
  });

  $('#order-delete .confirm').on('click', function () {
   //删除订单
    $('#order-delete').modal('hide');
    deleteOrder(orderId, function () {
      $curOrder.remove();
    });
  });

  function getCardInfo (id, callback) {
    $.ajax({
      url: '/stores/orders/' + id
    }) 
    .done(function (data) {
      if(data.msg !== '') {
        callback(data.msg);
      }
    })
    .error(function (errors) {
      console.log(errors);
    });
  }

  function showCardInfo(info) {
    var info = info.split('&');
    $('#order-detail').find('.card-id').text(info[0]);
    $('#order-detail').find('.card-pass').text(info[1]);
    $('#order-detail').modal();
  }

  function deleteOrder(id, callback) {
    $.ajax({
      url: '/stores/orders/' + id,
      method: 'delete'
    })
    .done(function (data) {
      if(data.status === 0 && data.code === 1) {
        callback();
      }
    })
    .error(function (errors) {
      console.log(errors);
    });
  }


});
