$(function () {
  if(!$('body').hasClass('projects_web') && !$('body').hasClass('projects_app') && !$('body').hasClass('projects_edit')) {
    return false;
  }

  var incomeMap = [0, 2, 5, 8, 10, 15, 30, 50, 100];
  var androidMap = ['2.2', '2.3', '2.3.3', '3.0', '3.1', '3.2', '4.0', '4.0.3', '4.1', '4.2', '4.3', '4.4', '4.5', '5.0', '5.1'];
  var iosMap = ['6.0', '7.0', '8.0'];
  // range slider
  if($('.slider-sys')) {
    $('#slider-android').noUiSlider({
      start: 0,
      range: {
        min: 0,
        max: 13
      },
      step: 1,
      connect: 'upper',
      format: {
        to: function (value) {
          return androidMap[value]; 
        },
        from: function (value) {
          return value;
        }
      }
    });
    $('#slider-android').noUiSlider_pips({
      mode: 'steps',
      density: 2,
      filter: function (value) {
        return value % 2 ? 2 :1;
      },
      format: {
        to: function (value) {
          value = value === 0 ? "Android" + androidMap[value] : androidMap[value];
          return value;
        },
        from: function (value) {
          return value;
        }
      }
    });
    $('#slider-ios').noUiSlider({
      start: 0,
      range: {
        min: 0,
        max: 2
      },
      step: 1,
      connect: 'upper',
      format: {
        to: function (value) {
          return iosMap[value];
        },
        from: function (value) {
          return value;
        }
      }
    });
    $('#slider-ios').noUiSlider_pips({
      mode: 'steps',
      format: {
        to: function (value) {
          return 'iOS' + iosMap[value]
        },
        from: function (value) {
          return value;
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
  $('#slider-user').noUiSlider_pips({
    mode: 'steps',
    format: {
      to: function (value) {
        return value + '个';
      },
      from: function (value) {
        return value;
      }
    }
  });
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
