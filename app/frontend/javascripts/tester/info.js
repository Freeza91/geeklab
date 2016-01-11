$(function () {

  var cityData = require('./city-data.js'),
      professionData = require('./profession-data.js'),
      professionLevelOne = professionData.professionLevelOne,
      professionLevelTow = professionData.professionLevelTow;

  var infoVm;
  // init testerInfoVm
  Geeklab.showLoading();
  var id = $('#id').attr('value');
  fetchTesterInfo(id, function (testerInfo) {
    initTesterVm(testerInfo);
    initSelect({
      birthday: infoVm.birthday,
      birthplace: infoVm.birthplace,
      livingplace: infoVm.livingplace,
      profession: infoVm.profession
    });
    Geeklab.removeLoading();
  });

  /* select initialization
   * birthday select
   * birthplace select
   * livingplace select
   * profession select
   */
  function initSelect(options) {
    var $birthYearSelect,
        $birthMonthSelect,
        $birthDateSelect,
        birthYearSelect,
        birthMonthSelect,
        birthDateSelect;

    if(options) {
      var birthday = options.birthday,
          birthplace = options.birthplace,
          livingplace = options.livingplace,
          profession = options.profession;
    }

    var defaultDateOption = [];
    for(var i = 1; i <= 31; i++) {
      defaultDateOption.push({value: i});
    }

    $birthYearSelect = $('#birth-year').selectize({
      onChange: function (value) {
        infoVm.birthday[0] = $.trim(value);
        if(infoVm.error.birthday) {
          infoVm.error.birthday = false;
        }

        birthDateSelect.disable();
        birthDateSelect.clearOptions();
        birthDateSelect.load(function (callback) {
          var results = defaultDateOption;
          birthDateSelect.enable();
          callback(results);

          birthMonthSelect.addItem(1, false);
          birthDateSelect.addItem(1, false);
        });
      }
    });

    $birthMonthSelect = $('#birth-month').selectize({
      onChange: function (value) {
        infoVm.birthday[1] = $.trim(value);

        var year = infoVm.birthday[0],
            month = value;

        birthDateSelect.disable();
        birthDateSelect.clearOptions();
        birthDateSelect.load(function (callback) {
          var dates = new Date(year, month, 0).getDate(),
              results = [];
          for(var i = 1; i <= dates; i++) {
            results.push({value: i});
          }
          birthDateSelect.enable();
          callback(results);
          birthDateSelect.addItem(1, false);
        });
      }
    });

    $birthDateSelect = $('#birth-date').selectize({
      labelField: 'value',
      onChange: function (value) {
        infoVm.birthday[2] = $.trim(value);
      }
    });

    birthYearSelect = $birthYearSelect[0].selectize;
    birthMonthSelect = $birthMonthSelect[0].selectize;
    birthDateSelect = $birthDateSelect[0].selectize;

    if(birthday && birthday.length > 0) {
      birthYearSelect.addItem(birthday[0], true);
      birthMonthSelect.addItem(birthday[1], true);
      birthDateSelect.disable();
      birthDateSelect.load(function (callback) {
        var dates = new Date(birthday[0], birthday[1], 0).getDate(),
            results = [];
        for(var i = 1; i <= dates; i++) {
          results.push({value: i});
        }
        birthDateSelect.enable();
        callback(results);
        birthDateSelect.addItem(birthday[2], false);
      });
    }


    var $birthProvSelect,
        $birthCitySelect,
        birthProvSelect,
        birthCitySelect;

    $birthProvSelect = $('#birthplace-prov').selectize({
      onChange: function (value) {
        // 更新model中的数据
        infoVm.birthplace[0] = value;
        if(infoVm.error.birthplace) {
          infoVm.error.birthplace = false;
        }

        // 更新二级类目
        birthCitySelect.disable();
        birthCitySelect.clearOptions();
        birthCitySelect.load(function (callback) {
          var results = cityData[value];
          if (results) {
            birthCitySelect.enable();
            callback(results);
            birthCitySelect.addItem(results[0].value, false);
          } else {
            return false;
          }
        });
      }
    });

    $birthCitySelect = $('#birthplace-city').selectize({
      labelField: 'value',
      onChange: function (value) {
        // 更新model中的数据
        infoVm.birthplace[1] = value;
      }
    });

    birthProvSelect = $birthProvSelect[0].selectize;
    birthCitySelect = $birthCitySelect[0].selectize;

    if(birthplace && birthplace.length > 0) {
      birthProvSelect.addItem(birthplace[0], true);
      birthCitySelect.load(function (callback) {
        var results = cityData[birthplace[0]];
        if (results) {
          birthCitySelect.enable();
          callback(results);
          birthCitySelect.addItem(birthplace[1], true);
        } else {
          return false;
        }
      });
    }

    var $livingProvSelect,
        $livingCitySelect,
        livingProvSelect,
        livingCitySelect;

    $livingProvSelect = $('#livingplace-prov').selectize({
      onChange: function (value) {
        // 更新model中的数据
        infoVm.livingplace[0] = value;
        if(infoVm.error.livingplace) {
          infoVm.error.livingplace = false;
        }

        // 更新二级类目
        livingCitySelect.disable();
        livingCitySelect.clearOptions();
        livingCitySelect.load(function (callback) {
          var results = cityData[value];
          if (results) {
            livingCitySelect.enable();
            callback(results);
            livingCitySelect.addItem(results[0].value, false);
          } else {
            return false;
          }
        });
      }
    });

    $livingCitySelect = $('#livingplace-city').selectize({
      labelField: 'value',
      onChange: function (value) {
        // 更新model中的数据
        infoVm.livingplace[1] = value;
      }
    });

    livingProvSelect = $livingProvSelect[0].selectize;
    livingCitySelect = $livingCitySelect[0].selectize;

    if(livingplace && livingplace.length > 0) {
      livingProvSelect.addItem(livingplace[0], true);
      livingCitySelect.load(function (callback) {
        var results = cityData[livingplace[0]];
        if (results) {
          livingCitySelect.enable();
          callback(results);
          livingCitySelect.addItem(livingplace[1], true);
        } else {
          return false;
        }
      });
    }

    var $professionLevelOneSelect,
        $professionLevelTwoSelect,
        professionLevelOneSelect,
        professionLevelTwoSelect;

    $professionLevelOneSelect = $('#profession-level-one').selectize({
      onChange: function (value) {
        // 更新model中的数据
        infoVm.profession[0] = value;
        if(infoVm.error.profession) {
          infoVm.error.profession = false;
        }

        // 更新二级类目
        professionLevelTwoSelect.disable();
        professionLevelTwoSelect.clearOptions();
        professionLevelTwoSelect.load(function (callback) {
          var results = professionLevelTow[value];
          if (results) {
            professionLevelTwoSelect.enable();
            callback(results);
            professionLevelTwoSelect.addItem(results[0].value, false);
          } else {
            return false;
          }
        });
      }
    });

    $professionLevelTwoSelect = $('#profession-level-two').selectize({
      labelField: 'value',
      onChange: function (value) {
        infoVm.profession[1] = value;
      }
    });

    professionLevelOneSelect = $professionLevelOneSelect[0].selectize;
    professionLevelTwoSelect = $professionLevelTwoSelect[0].selectize;

    if(profession && profession.length > 0) {
      professionLevelOneSelect.addItem(profession[0], true);
      professionLevelTwoSelect.load(function (callback) {
        var results = professionLevelTow[profession[0]];
        if (results) {
          professionLevelTwoSelect.enable();
          callback(results);
          professionLevelTwoSelect.addItem(profession[1], true);
        } else {
          return false;
        }
      });
    }
  }

  function fetchTesterInfo (id, callback) {
    $.ajax({
      url: '/testers/' + id,
    }).done(function (data) {
      if(data.status === 0 && data.code ===1) {
        callback(data.tester);
      }
    });
  }

  function initTesterVm (testerInfo) {
    var testerInfoDefault = {
      name: '',
      email: '',
      cellphone: '',
      sex: '男',
      birthday: [],
      birthplace: [],
      livingplace: [],
      device: [],
      emotion: '单身',
      orientation: '异性恋',
      education: '本科',
      profession: [],
      income: '0-2',
      interest: [],
      hint: {
        email: '',
        cellphone: ''
      },
      error: {
        name: false,
        email: false,
        cellphone: false,
        device: false,
        birthday: false,
        birthplace: false,
        livingplace: false,
        profession: false
      }
    };

    $.extend(testerInfoDefault, testerInfo);

    infoVm = new Vue({
      el:  '#tester-info',
      data: testerInfoDefault,
      methods: {
        updateDevice: updateDevice,
        updateInterest: updateInterest,
        checkValue: checkValue,
        submit: submit
      }
    });
  }

  function checkValue (vm, event, type) {
    var target = event.target,
        value = target.value,
        name = target.name;
    if(value && !Geeklab.formValueValid(value, type)) {
      vm.hint[name] = '格式错误';
      vm.error[name] = true;
    }
    return false;
  }

  function generateTesterInfo (vm) {
    var testerInfo = vm.$data,
        data = {};

    data.id = id;
    data.username = testerInfo.name;
    data.email_contract = testerInfo.email;
    data.mobile_phone = testerInfo.cellphone

    data.sex = testerInfo.sex;
    data.birthday = testerInfo.birthday.join('-');;
    data.birthplace = testerInfo.birthplace.join('-');
    data.livingplace = testerInfo.livingplace.join('-');

    data.device = testerInfo.device;
    data.emotional_status = testerInfo.emotion;
    data.sex_orientation = testerInfo.orientation;
    data.education = testerInfo.education;
    if (testerInfo.profession[1]) {
      data.profession = testerInfo.profession.join('-');
    } else {
      data.profession = testerInfo.profession[0];
    }
    data.income = testerInfo.income;
    data.interest = testerInfo.interest;

    return data;
  }

  function checkTesterInfo (vm) {
    var result = true;

    if(!vm.name) {
      vm.error.name = true;
      result = false;
    }

    if(!vm.email) {
      vm.hint.email = '请输入邮箱';
      vm.error.email = true;
      result = false;
    } else {
      if(!Geeklab.formValueValid(vm.email, 'email')) {
        vm.hint.email = '格式错误';
        vm.error.email = true;
        result = false;
      }
    }

    if(!vm.cellphone) {
      vm.hint.cellphone = '请输入手机号';
      vm.error.cellphone = true;
      result = false;
    } else {
      if(!Geeklab.formValueValid(vm.cellphone, 'mobile_phone')) {
        vm.hint.cellphone = '格式错误';
        vm.error.cellphone = true;
        result = false;
      }
    }

    if(vm.device.length === 0) {
      vm.error.device = true;
      result = false;
    }

    if(vm.birthday.length < 3) {
      vm.error.birthday = true;
      result = false;
    }

    if(vm.birthplace.length < 2) {
      vm.error.birthplace = true;
      result = false;
    }

    if(vm.livingplace.length < 2) {
      vm.error.livingplace = true;
      result = false;
    }

    if(vm.profession.length < 2) {
      vm.error.profession = true;
      result = false;
    }

    if(!result) {
      $('html, body').animate({
        scrollTop: 100
      }, 800);
    }

    return result;
  }

  function postTesterInfo (data, callback) {
    $.ajax({
      url: '/testers/' + id,
      method: 'put',
      data: data
    })
    .done(function (data) {
      if(data.status === 0 && data.code === 1) {
        callback();
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });

  }

  function updateDevice (vm, event) {
    var target = event.target,
        value = target.value;
    if(vm.error.device) {
      vm.error.device = false;
    }
    if(target.checked) {
      vm.device.push(value);
    } else {
      var index = vm.device.indexOf(value);
      if(index !== -1) {
        vm.device.splice(index, 1);
      }
    }
  }

  function updateInterest (vm, event) {
    var target = event.target,
        value = target.value;
    if(target.checked) {
      vm.interest.push(value);
    } else {
      var index = vm.interest.indexOf(value);
      if(index !== -1) {
        vm.interest.splice(index, 1);
      }
    }
  }

  function submit (vm, event) {
    event.preventDefault();
    if(checkTesterInfo(vm)) {
      var testerInfo = generateTesterInfo(vm);
       //loading
      Geeklab.showLoading();
      postTesterInfo(
        testerInfo,
        function () {
          setTimeout(function () {
            if($('body').hasClass('testers_new')) {
              Geeklab.removeLoading();
              var $modal = $('#form-finish');
              $('body').append('<div class="main-mask"></div>')
              $modal.addClass('show');
            } else {
              location.href = '/testers';
            }
          }, 1500);
        });
    } else {
      return false;
    }
  }


  function updateErrorPosition (newErrorPosition, errorPosition) {
    if (errorPosition) {
      if (newErrorPosition.top < errorPosition.top) {
        return newErrorPosition;
      } else {
        return errorPosition;
      }
    } else {
      return newErrorPosition;
    }
  }

  function scrollToErrorArea (errorPosition) {
    var errorTop = errorPosition.top,
        windowVerticalCenter = $(window).height() / 2;
    if (errorTop < windowVerticalCenter) {
      $(window).scrollTop(0);
    } else {
      $(window).scrollTop(errorTop - windowVerticalCenter);
    }
  }
});
