$(function () {
  if(!$('body').hasClass('projects_web') && !$('body').hasClass('projects_app') && !$('body').hasClass('projects_edit')) {
    return false;
  }

  var incomeMap = [0, 2, 5, 8, 10, 15, 30, 50, 100];
  // range slider
  var userSlider = $('#slider-user');
  userSlider.noUiSlider({
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
  userSlider.Link('lower').to('-inline-<div class="slider-value"></div>', function (value) {
    $(this).html(
      '<span>' + value + '个</span><div class="fa fa-edit"></div><input class="count-input" type="text" onchange="Geeklab.setUserCount(event)">'
    )
  });
  Geeklab = window.Geeklab || {};
  window.Geeklab = Geeklab;
  Geeklab.setUserCount = function (event) {
    var value = event.target.value;
    userSlider.val(value);
  }

  $('#slider-user .slider-value').on('click', function (event, value) {
    var $this = $(this),
        value = value || '';
    $this.find('input').css('visibility', 'visible').focus();
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

  // init sortable task list
  var sortEl = document.getElementById('task-list');
  var sortable = Sortable.create(sortEl, {
    handle: '.drag-handle'
  });

});
