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
    var id = $(this).data('id'),
        pass= $(this).data('pass');
    $('#order-detail').find('.card-id').text(id);
    $('#order-detail').find('.card-pass').text(pass);
    $('#order-detail').modal();
  });

  $('#order-delete .confirm').on('click', function () {
    console.log($curOrder, orderId);
    // 删除订单
    //$.ajax({
      //url: '/stores/orders/' + orderId,
      //method: 'delete'
    //})
    //.done(function () {
      //if(data.status === 0 && data.code === 1) {
        //$curOrder.remove();
      //}
    //})
    //.error(function (errors) {
      //console.log(errors);
    //})
  });
});
