$(function () {
  if(!$('body').hasClass('projects_web') && !$('body').hasClass('projects_app') && !$('body').hasClass('projects_edit')) {
    return false;
  }

  var incomeMap = [0, 2, 5, 8, 10, 15, 30, 50, 100];
  // range slider
  $('#slider-user').noUiSlider({
    start: 10,
    range: {
      min: 1,
      max: 15
    },
    step: 1,
    format:  {
      to: function (value) {
        return parseInt(value);
      },
      from: function (value) {
        return parseInt(value);
      }
    }
  });
  $('#slider-user').Link('lower').to('-inline-<div class="slider-value"></div>', function (value) {
    $(this).html(
      '<span>' + value + '个</span>'
    )
  });
  //$('#slider-user').noUiSlider_pips({
    //mode: 'steps',
    //format: {
      //to: function (value) {
        //return value + '个';
      //},
      //from: function (value) {
        //return value;
      //}
    //}
  //});
  $('#slider-age').noUiSlider({
    start: [18, 48],
    margin: 5,
    range: {
      min: 18,
      max: 48
    },
    step: 5,
    connect: true,
    format:  {
      to: function (value) {
        return parseInt(value);
      },
      from: function (value) {
        return parseInt(value);
      }
    }
  });
  $('#slider-age').Link('lower').to('-inline-<div class="slider-value"></div>', function (value) {
    $(this).html(
      '<span>' + value + '岁</span>'
    )
  });
  $('#slider-age').Link('upper').to('-inline-<div class="slider-value"></div>', function (value) {
    $(this).html(
      '<span>' + value + '岁</span>'
    )
  });
  $('#slider-income').noUiSlider({
    start: [0, 8],
    margin: 1,
    range: {
      min: 0,
      max: 8
    },
    step: 1,
    connect: true,
    format: {
      to: function (value) {
        return incomeMap[value];
      },
      from: function (value) {
        return value;
      }
    }
  });
  $('#slider-income').Link('lower').to('-inline-<div class="slider-value"></div>', function (value) {
    if (value !== 0) {
      value += '万';
    }
    $(this).html(
      '<span>' + value + '</span>'
    )
  });
  $('#slider-income').Link('upper').to('-inline-<div class="slider-value"></div>', function (value) {
    $(this).html(
      '<span>' + value + '万</span>'
    )
  });

});
