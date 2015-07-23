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
      setAddr: true
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

  function exchange(vm) {
    if(!$(event.target).hasClass('exchange')) {
      return false;
    }
    var price = vm.price;
    checkScore(vm, function(vm) {
      checkStock(vm, function(vm) {
        if (!vm.showAddr) {
          // 填写地址
          getAddr(vm, function(vm, data) {
            showAddrForm(vm, data);
          });
        } else {
          // 生成订单
          sendExchange(vm.id);
        }
      });
    });
  }

  function getAddr (vm, callback) {
    var url = '';
    console.log('getAddr executed');
    callback(vm)
    //$.ajax({
      //url: url
    //})
    //.done(function (data) {
      //if(data) {
        //callback(vm, data);
      //}
    //})
    //.error(function (errors) {
      //console.log(errors);
    //});
  }

  function showAddrForm (vm, addrInfo) {
    console.log(!!addrInfo);
    if(addrInfo) {
      vm.name = addrInfo.name;
      vm.phone = addrInfo.phone;
      vm.addr = addrInfo.addr;
    }
    vm.showAddr = true;
  }

  function checkScore (vm, callback) {
    var url = '';
    console.log('checkScore executed')
    callback(vm);
    //$.ajax({
      //url: url
    //})
    //.done(function (data) {
      //if (score > price) {
        //// 积分充足
        //callback(data);
      //} else {
        //// 提示积分不够
        //$('#score-hint').modal();
      //}
    //})
    //.error(function (errors) {

    //});
  }
  function checkStock (vm, callback) {
    var url = '';
    console.log('checkStock executed');
    callback(vm);
    //$.ajax({
      //url: url,
    //}) 
    //.done(function (data) {
      //if(data.statu === 0 && data.code === 1) {
        //callback(vm); 
      //} else {
        // 提示库存不足
        // $('#stock-hint').modal();
      //}
    //})
    //.error(function (errors) {
      //console.log(errors);
    //});
  }

  function sendExchange (goodId) {
    console.log('sendExchange executed');
    console.log('goodId: ', goodId);
    return false;

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
