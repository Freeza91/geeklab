$(function () {
  if(!$('body').hasClass('orders_index')) {
    return false;
  }

  var ordersVm = new Vue({
    el: '#orders',
    data: {
      page: 1,
      orders: [],
    },
    methods: {
      prevPage: prevPage,
      nextPage: nextPage,
      showDetail: showDetail,
      deleteOrder: deleteOrder
    }
  });
  function prevPage (vm) {
    vm.page--;
    getGoodPagin(vm.page);
  }

  function nextPage (vm) {
    vm.page++;
    getGoodPagin(vm.page);
  }

  function getOrderPaging (page, callback) {
    var url = '/stores/orders',
        cacheKey = 'page' + page;

    $.ajax({
      url: url,
      dataType: 'json',
      data: {
        page: page,
      }
    })
    .done(function (data) {
      if(data.status === 0 && data.code === 1) {
        ordersVm.orders = data.orders;
      }
    })
    .error(function (errors) {
      console.log(errors);
    });
  }
  // 获取第一页
  getOrderPaging(1);

  var $curOrder,
      orderId;

  $('#order-delete .confirm').on('click', function () {
   //删除订单
    $('#order-delete').modal('hide');
    sendDeleteOrderRequest (orderId, function () {
      $curOrder.remove();
    });
  });

  function showDetail (order) {
    var orderId = order.id;
    getOrderInfo(orderId, function (data) {
      if (data.msg) {
        showOrderInfo(data.msg, data.virtual);
      } else {
        $('#express-hint').modal();
      }
    });
  }

  function deleteOrder (order, event) {
    orderId = order.id;
    $curOrder  = $(event.target).parents('.order-item');
    $('#order-delete').modal();
  }

  function getOrderInfo (id, callback) {
    var url =  '/stores/orders/' + id

    $.ajax({
      url: '/stores/orders/' + id
    })
    .done(function (data) {
      callback(data);
    })
    .error(function (errors) {
      console.log(errors);
    });
  }

  function showOrderInfo(info, virtual) {
    var info = info.split('&'),
        $modal = $('#order-detail');

    $modal.find('.card-id').text(info[0]);
    $modal.find('.card-pass').text(info[1]);
    if(virtual) {
      $modal.find('.good-virtual').show();
      $modal.find('.good-reality').hide();
    } else {
      $modal.find('.good-reality').show();
      $modal.find('.good-virtual').hide();
    }
    $modal.modal();
  }

  function sendDeleteOrderRequest(id, callback) {
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
