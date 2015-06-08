$(function () {
  if(!$('body').hasClass('pms_new')) {
    return false;
  }

  // range slider
  var valueMap = [
    'type1',
    'type2',
    'type3',
    'type4',
    'type5',
    'type6',
    'type7'
  ];
  $('#sys-slider').noUiSlider({
    start: 2,
    range: {
      min: 0,
      max: 6
    },
    step: 1,
    connect: 'upper'
  });
  //$('#slider').Link('lower').to($('.lower'));
  //$('#slider').Link('upper').to($('.upper'));
  
  var vm = new Vue({
    el: '.form',
    data: {
      platform: 'ios',
      device: 'tablet'
    }
  });
  
  $('.getvalue').on('click', function () {
    var data = {};
    var vmData = vm.$data;

    // 获取数据
    data.platform = vmData.platform;
    data.device = vmData.device;

    console.log(data);
  });
});
