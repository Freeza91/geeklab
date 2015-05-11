$(function () {
  if(!$('body').hasClass('testers_new')) {
    return false;
  }

  // birth select init
  $('#birth').dateSelect({
    required: false
  });

  // city select init
  $('#birthplace').citySelect({
    url: '/assets/cityselect_data.min',
    nodata: 'none',
    required: false
  });
  $('#livingplace').citySelect({
    url: '/assets/cityselect_data.min',
    nodata: 'none',
    required: false
  });

  // profession select init
  var profession = {
    "citylist": [
      {
        "p": "职业1", 
        "c": [
          {"n": 1},
          {"n": 2},
          {"n": 3},
          {"n": 4},
          {"n": 5},
        ]
      },
      {
        "p": "职业2", 
        "c": [
          {"n": 1},
          {"n": 2},
          {"n": 3},
          {"n": 4},
          {"n": 5},
        ]
      },
      {
        "p": "职业3", 
        "c": [
          {"n": 1},
          {"n": 2},
          {"n": 3},
          {"n": 4},
          {"n": 5},
        ]
      },
      {
        "p": "职业4", 
        "c": [
          {"n": 1},
          {"n": 2},
          {"n": 3},
          {"n": 4},
          {"n": 5},
        ]
      }
    ]
  };
  $('#profession').citySelect({
    // 不知道为什么不能从 professionselect_data.js中获取数据
    url: profession,
    nodata: 'none',
    required: false
  });

  // 感情状况， 性取向, 教育程度， 收入 init
  var initData = {
    'citylist': [
      {'p': 1},
      {'p': 2},
      {'p': 3},
      {'p': 4},
      {'p': 5},
    ]
  }
  $('#emotion').citySelect({
    url: initData,
    nodata: 'none',
    required: false
  });
  $('#sex_orientation').citySelect({
    url: initData,
    nodata: 'none',
    required: false
  });
  $('#education').citySelect({
    url: initData,
    nodata: 'none',
    required: false
  });
  $('#income').citySelect({
    url: initData,
    nodata: 'none',
    required: false
  });
  $('.info-form .submit').on('click', function (event) {
    event.preventDefault();

    var data = {};
    var $form = $('.info-form');
    var $infoSet = $form.find('.form-group');

    // 清理验证提示信息
    $form.find('.has-error').removeClass('has-error').find('.form-control-feedback').addClass('sr-only');
    // 表单是否通过验证的标志
    var valided = true;

    $infoSet.each(function(index,item) {
      var $item = $(item)
      var key = $item.find('.info-title').data('name');
      var type = $item.data('type');
      var value = '';
      var infoName = '';
      var $el;
      switch(type){
        case 'text':
          value = $item.find('input').val();
          if($item.hasClass('required')) {
            $el = $item.find('input');
            infoName = $item.find('input').data('infoName'); 
            valided = textValid($el, infoName);
          }
        break;
        case 'radio':
          value = $item.find('input:radio:checked').val();
          if(value === undefined) {
            $item.addClass('has-error').find('.form-control-feedback').removeClass('sr-only');
            valided = false;
          }
        break;
        case 'checkbox':
          value = [];
          $checkboxSet = $item.find('input:checkbox:checked');
          if($item.hasClass('required') && $checkboxSet.length === 0) {
            $item.addClass('has-error').find('.form-control-feedback').removeClass('sr-only')
            valided = false;
          }
          $checkboxSet.each(function (index, checkbox) {
            value.push($(checkbox).val());
          });
        break;
        case 'select':
          $selectSet = $item.find('select');
          for(var i = 0; i < $selectSet.length; i++) {
            var $select = $($selectSet[i]);
            console.log($select.val());
            if($select.val() === '') {
              valided = false;
              $item.addClass('has-error').find('.form-control-feedback').removeClass('sr-only');
              break;
            } else {
              if(i > 0) {
                value += '-';
              }
              value += $select.val();
            }
          }
        break;
      }
      data[key] = value;
    });
    console.log(data);

    console.log(valided);
    if(!valided) {
      return false;
    }
    
    $.ajax({
      url: '/testers',
      method: 'post',
      data: data
    })
    .done(function (data, status, xhr) {
      console.log(data);
    })
    .error(function (errors, status) {
      console.log(errors);
    })
  });

  // 文本字段验证
  function textValid($el, type) {
    var result;
    var value = $el.val();
    var $root = $el.parents('.form-group');
    switch(type) {
      case 'email':
        result = emailValid(value, $el); 
        if(!result) {
          $root.find('.form-control-feedback').removeClass('sr-only');
        }
      break;
      case 'nickname':
        result = formValid(value, 'required');
        if(!result) {
          $root.addClass('has-error').find('.form-control-feedback').removeClass('sr-only');
        }
      break;
      case 'mobile_phone':
      if(value === '') {
        $root.addClass('has-error').find('.form-control-feedback').removeClass('sr-only').text('请输入手机号');
        result = false;
      } else {
        result = formValid(value, 'mobile_phone');
        if(!result) {
          $root.addClass('has-error').find('.form-control-feedback').removeClass('sr-only').text('格式错误');
        }
      }
      break;
    }
    return result;
  }

  // 让title垂直居中
  function verticalMiddleTitle() {
    var titleSet = $('.info-form .title'); 
    titleSet.each(function(index, title) {
      var $title = $(title);
      var $root = $title.parents('fieldset');
      var height = $root.height();
      $title.css('line-height', height + 'px');
    })
  }
  verticalMiddleTitle();
});
