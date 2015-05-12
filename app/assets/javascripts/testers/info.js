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
      {"p": "无"},
      {"p": "学生"},
      {
        "p": "信息技术",
        "c": [
          {"n": "互联网"},
          {"n": "IT"},
          {"n": "通讯"},
          {"n": "电信运营"},
          {"n": "网络游戏"}
        ]
      },
      {
        "p": "金融保险",
        "c": [
          {"n": "投资"},
          {"n": "股票/基金"},
          {"n": "保险"},
          {"n": "银行"},
          {"n": "信托保险"}
        ]
      },
      {
        "p": "商业服务",
        "c": [
          {"n": "咨询"},
          {"n": "个体运营"},
          {"n": "美容美发"},
          {"n": "旅游"},
          {"n": "酒店餐饮"},
          {"n": "休闲娱乐"},
          {"n": "贸易"},
          {"n": "汽车"},
          {"n": "房地产"},
          {"n": "物业管理"},
          {"n": "装修/装潢"}
        ]
      },
      {
        "p": "工程制造",
        "c": [
          {"n": "建筑"},
          {"n": "土木工程"},
          {"n": "机械制造"},
          {"n": "电子"},
          {"n": "生物医药"},
          {"n": "食品"},
          {"n": "服装"},
          {"n": "能源"}
        ]
      },
      {
        "p": "交通运输",
        "c": [
          {"n": "航空"},
          {"n": "铁路"},
          {"n": "航运/船舶"},
          {"n": "公共交通"},
          {"n": "物流运输"}
        ]
      },
      {
        "p": "文化传媒",
        "c": [
          {"n": "媒体出版"},
          {"n": "设计"},
          {"n": "文化传播"},
          {"n": "广告创意"},
          {"n": "动漫"},
          {"n": "公关/会展"},
          {"n": "摄影"}
        ]
      },
      {
        "p": "娱乐体育",
        "c": [
          {"n": "影视"},
          {"n": "运动体育"},
          {"n": "音乐"},
          {"n": "模特"}
        ]
      },
      {
        "p": "公共事业",
        "c": [
          {"n": "医疗"},
          {"n": "法律"},
          {"n": "教育"},
          {"n": "政府机关"},
          {"n": "科研"},
          {"n": "公益"}
        ]
      },
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
  var emotionData = {
    'citylist': [
      {'p': '单身'},
      {'p': '恋爱中'},
      {'p': '已婚'}
    ]
  };
  var sexOrientationData = {
    'citylist': [
      {'p': '异性恋'},
      {'p': '同性恋'},
      {'p': '双性恋'}
    ]
  };
  var educationData = {
    'citylist': [
      {'p': '高中及以下'},
      {'p': '大专'},
      {'p': '本科'},
      {'p': '硕士'},
      {'p': '博士'}
    ]
  };
  var incomeData = {
    'citylist': [
      {'p': '2万以下'},
      {'p': '2-5万'},
      {'p': '5-8万'},
      {'p': '8-10万'},
      {'p': '10-15万'},
      {'p': '15-30万'},
      {'p': '30-50万'},
      {'p': '50-100万'},
      {'p': '100万以上'},
    ]
  };
  $('#emotion').citySelect({
    url: emotionData,
    nodata: 'none',
    required: false
  });
  $('#sex_orientation').citySelect({
    url: sexOrientationData,
    nodata: 'none',
    required: false
  });
  $('#education').citySelect({
    url: educationData,
    nodata: 'none',
    required: false
  });
  $('#income').citySelect({
    url: incomeData,
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
