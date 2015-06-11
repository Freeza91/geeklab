$(function () {
  if(!$('body').hasClass('projects_web') && !$('body').hasClass('projects_app')) {
    return false;
  }

  var incomeMap = [0, 2, 5, 8, 10, 15, 30, 50, 100];
  var androidMap = ['1.5', '2.2', '2.3', '2.3.3', '3.0', '3.1', '3.2', '4.0', '4.0.3', '4.1', '4.2', '4.3', '4.4', '4.5', '5.0', '5.1'];
  var iosMap = ['1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0', '8.0'];
  // range slider
  if($('.slider-sys')) {
    $('#slider-android').noUiSlider({
      start: 2,
      range: {
        min: 0,
        max: 14
      },
      step: 1,
      connect: 'upper',
      format: {
        to: function (value) {
          return androidMap[value]; 
        },
        from: function (value) {
          return androidMap[value]; 
        }
      }
    });
    $('#slider-ios').noUiSlider({
      start: 2,
      range: {
        min: 0,
        max: 7
      },
      step: 1,
      connect: 'upper',
      format: {
        to: function (value) {
          return iosMap[value];
        },
        from: function (value) {
          return iosMap[value];
        }
      }
    });
  }
  $('#slider-user').noUiSlider({
    start: 3,
    range: {
      min: 1,
      max: 5
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
  $('#slider-age').noUiSlider({
    start: [18, 48],
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
