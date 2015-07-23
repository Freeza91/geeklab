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
        callback(data.msg, 'virtual');
      }
    })
    .error(function (errors) {
      console.log(errors);
    });
  }

  function showCardInfo(info, type) {
    var info = info.split('&'),
        $modal = $('#order-detail');

    $modal.find('.card-id').text(info[0]);
    $modal.find('.card-pass').text(info[1]);
    if(type === 'virtual') {
      $modal.find('.good-virtual').show();
      $modal.find('.good-reality').hide();
    } else {
      $modal.find('.good-reality').show();
      $modal.find('.good-virtual').hide();
    }
    $modal.modal();
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
