$(function () {
  if(!$('body').hasClass('pms_web')) {
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
  //$('#slider').Link('lower').to($('.lower'));
  
  var vm = new Vue({
    el: '.form',
    data: {
      sex: [
        {
          key: '男',
          checked: true
        },
        {
          key: '女',
          checked: true
        }
      ],
      city: [
        {
          key: '一线城市',
          checked: true
        },
        {
          key: '二线城市',
          checked: true
        },
        {
        key: '三线城市',
        checked: true
        }
      ],
      education: [
        {
          key: '高中及以下',
          checked: true
        },
        {
          key: '大专',
          checked: true
        },
        {
          key: '本科',
          checked: true
        },
        {
          key: '硕士',
          checked: true
        },
        {
          key: '博士',
          checked: true
        }
      ],
      emotion: [
        {
          key: '单身',
          checked: true
        },
        {
          key: '恋爱中',
          checked: true
        },
        {
          key: '已婚',
          checked: true
        }
      ],
      orientation: [
        {
          key: '异性恋',
          checked: true
        },
        {
          key: '同性恋',
          checked: true
        },
        {
          key: '双性恋',
          checked: true
        }
      ],
      interests: [
        {
          key: '足球',
          checked: false
        },
        {
          key: '健身',
          checked: false
        },
        {
          key: '旅游',
          checked: false
        },
        {
          key: '二次元',
          checked: false
        },
        {
          key: '音乐',
          checked: false
        },
        {
          key: '看书',
          checked: false
        },
        {
          key: '电影',
          checked: false
        },
        {
          key: '星座',
          checked: false
        }
      ],
      tasks: [
        {
          content: ''
        },
        {
          content: ''
        },
        {
          content: ''
        }
      ]
    }
  });
  
  $('.getvalue').on('click', function () {
    var data = {};
    var vmData = vm.$data;

    // 获取数据
    data.name = vmData.name;
    data.website = vmData.website;
    data.introduction = vmData.introduction;
    
    data.sex = getVmCheckboxArr(vmData.sex);
    data.city = getVmCheckboxArr(vmData.city);
    data.education = getVmCheckboxArr(vmData.education);
    data.emotion = getVmCheckboxArr(vmData.emotion);
    data.orientation = getVmCheckboxArr(vmData.orientation);
    data.interests = getVmCheckboxArr(vmData.interests);

    data.username = vmData.username;
    data.mobile = vmData.mobile;
    data.email= vmData.email;
    data.company = vmData.company;
 
    var userCount = $('#slider-user').val();
    var age = $('#slider-age').val();
    var income = $('#slider-income').val();
    data.userCount = userCount;
    data.age = age;
    data.income = income;

    console.log(data);
  });

  function getVmCheckboxArr (vmArr) {
    var result = [];
    vmArr.forEach(function (item) {
      if(item.checked) {
        result.push(item.key);
      }
    });
    return result;
  }
});
