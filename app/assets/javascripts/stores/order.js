$(function () {
  if(!$('body').hasClass('orders_index')) {
    return false;
  }

  var ordersVm = new Vue({
    el: '#orders',
    data: {
      page: 1,
      orders: [],
      lastPage: false
    },
    methods: {
      prevPage: prevPage,
      nextPage: nextPage,
      showDetail: showDetail,
      deleteOrder: deleteOrder,
      selectOrder: selectOrder
    }
  });
  function prevPage (vm) {
    if(vm.page === 1) {
      return false;
    }
    vm.page -= 1;
    vm.lastPage = false;
    getOrderPaging(vm.page);
  }

  function nextPage (vm) {
    if(vm.lastPage) {
      return false;
    }
    vm.page++;
    getOrderPaging(vm.page);
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
        if(data.orders.length > 0) {
          ordersVm.orders = data.orders;
        } else {
          ordersVm.page -= 1;
          ordersVm.lastPage = true;
        }
        if(data.orders.length < 4) {
          ordersVm.lastPage = true;
        }
      }
    })
    .error(function (errors) {
      console.log(errors);
    });
  }
  // 获取第一页
  getOrderPaging(1);

  var $curOrder,
      orderId,
      orderIndex;
  $('#order-delete .confirm').on('click', function () {
   //删除订单
    $('#order-delete').modal('hide');
    sendDeleteOrderRequest (orderId, function () {
      ordersVm.orders.$remove(orderIndex)
    });
  });

  function showDetail (order) {
    var orderId = order.id;
    getOrderInfo(orderId, function (data) {
      showOrderInfo(data);
    });
  }

  function deleteOrder (order, index, event) {
    orderId = order.id;
    orderIndex = index;
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

  function showOrderInfo(data) {
    var info,
        $modal = $('#order-detail');
    if (data.msg) {
      info = data.msg.split('&');
      $modal.find('.card-id').text(info[0]);
      $modal.find('.card-pass').text(info[1]);
    } else {
      $modal.find('.card-id').text('暂无');
      $modal.find('.card-pass').text('暂无');
    }
    if(data.virtual) {
      $modal.find('.good-virtual').show();
      $modal.find('.good-reality').hide();
    } else {
      $modal.find('.express-status').text(data.express_status);
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

  function selectOrder(event) {
    $('.order-item.active').removeClass('active');
    $(event.target).parents('.order-item').addClass('active');
  }

});
