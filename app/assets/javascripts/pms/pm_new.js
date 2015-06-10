$(function () {
  if(!$('body').hasClass('pms_web') && !$('body').hasClass('pms_app')) {
    return false;
  }

  var incomeMap = [0, 2, 5, 8, 10, 15, 30, 50, 100];
  // range slider
  $('#slider-sys').noUiSlider({
    start: 2,
    range: {
      min: 0,
      max: 6
    },
    step: 1,
    connect: 'upper'
  });
  $('#slider-user').noUiSlider({
    start: 3,
    range: {
      min: 1,
      max: 5
    },
    step: 1
  });
  $('#slider-age').noUiSlider({
    start: [18, 48],
    range: {
      min: 18,
      max: 48
    },
    step: 5,
    connect: true
  });
  $('#slider-income').noUiSlider({
    start: [0, 8],
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
        return incomeMap[value];
      }
    }
  });
});
