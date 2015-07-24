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
      showAddr: false,
      error: {
        name: false,
        phone: false,
        addr: false
      },
      setAddr: true,
    },
    methods: {
      toggleGallery: toggleGallery,
      exchange: exchange,
      checkValue: checkValue
    }
  });

  function toggleGallery (picUrl, event) {
    goodVm.galleryMain = picUrl;
    $('.good-selected').removeClass('good-selected');
    event.target.className += 'good-selected';
  }

  function exchange(vm, event) {
    if(!$(event.target).hasClass('exchange')) {
      return false;
    }
    event.target.innerText = '确认兑换'
    checkGoodStatus(vm, function (vm, data) {
      if (vm.virtual === 'false' && !vm.showAddr) {
        // 不是虚拟商品时填写地址
        showAddrForm(vm, data.address);
      } else {
        // 检查地址输入
        // 生成订单
        var order = {
          good_id: vm.id,
          address: {
            name: vm.name,
            tel: vm.phone,
            location: vm.addr,
            is_save: vm.setAddr
          }
        };
        createOrder(order);
      }
    });
  }

  function checkGoodStatus (vm, callback) {
    var url = '/stores/goods/' + vm.id + '/lookup'

    $.ajax({
      url: url
    })
    .done(function (data) {
      if(data.status === 0) {
        switch (data.code) {
          case 1:
            // 可以下订单
            callback(vm, data);
          break;
          case 2:
            // 积分不足
            $('#score-hint').modal();
          break;
          case 3:
            // 库存不足
            $('#stock-hint').modal();
          break;
        }
      }
    })
    .error(function (errors) {
      console.log(errors);
    })
  }

  function showAddrForm (vm, addrInfo) {
    if(addrInfo) {
      vm.$set('name', addrInfo.name);
      vm.$set('phone', addrInfo.tel);
      vm.$set('addr', addrInfo.location);
    }
    vm.showAddr = true;
  }

  function createOrder (order) {

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
            $('#stock-hint').modal();
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

  function checkValue (vm, modelName, type, value, length) {
    if (!value) {
      // 没有输入时不作检测
      return false;
    }
    if (!valid(type, value, length)) {
      vm.error[modelName] = true;
    } else {
      vm.error[modelName] = false;
    }
  }

  function valid (type, value, length) {
    var result = true;
    switch(type) {
      case 'length':
        if (value.length > length) {
          result = false;
        }
      break;
      case 'phone':
        var mobileReg = /^1[3|5|7|8][0-9]{9}$/;
        result = mobileReg.test(value);
      break;
    }
    return result;
  }
});
