$(function () {
  if(!$('body').hasClass('projects_app')) {
    return false;
  }

  var vm = new Vue({
    el: '.form',
    data: {
      step: 1,
      platform: 'ios',
      device: 'tablet',
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
    },
    methods: {
      previousStep: previousStep,
      nextStep: nextStep,
      submit: submit
    }
  });
  
  $('.getvalue').on('click', submit); 

  function submit (event) {
    event.preventDefault();
    var data = {};
    var vmData = vm.$data;

    // 获取数据
    data.name = vmData.name;
    data.platform = vmData.platform;
    data.device = vmData.device;
    data.profile = vmData.introduction;
    
    data.sex = getVmCheckboxArr(vmData.sex);
    data.city = getVmCheckboxArr(vmData.city);
    data.education = getVmCheckboxArr(vmData.education);
    data.emotion = getVmCheckboxArr(vmData.emotion);
    data.orientation = getVmCheckboxArr(vmData.orientation);
    data.interests = getVmCheckboxArr(vmData.interests);

    data.tasks = [];
    vmData.tasks.forEach(function (task) {
      data.tasks.push({
        content: task.content
      });
    });

    data.contact_name = vmData.username;
    data.phone = vmData.mobile;
    data.email= vmData.email;
    data.company = vmData.company;
 
    var userCount = $('#slider-user').val();
    var age = $('#slider-age').val();
    var income = $('#slider-income').val();
    var sys = data.platform === 'ios' ? $('#slider-ios').val() : $('#slider-android').val();
    data.userCount = userCount;
    data.age = age.join('-');
    data.income = income.join('-');
    data.requirement = sys;

    console.log(data);

    var url = '/pms';
    $.ajax({
      url: url,
      method: 'post',
      data: data
    })
    .done(function (data, status) {

    })
    .error(function (errors, status) {
      console.log(errors);
    });
  }

  function getVmCheckboxArr (vmArr) {
    var result = [];
    vmArr.forEach(function (item) {
      if(item.checked) {
        result.push(item.key);
      }
    });
    return result;
  }

  function localImageView (image, $img) {
    var url = window.URL.createObjectURL(image);
    $img.src = url;
  }

  function previousStep (event) {
    event.preventDefault();
    vm.step--;
  }
  function nextStep (event) {
    event.preventDefault();
    vm.step++;
  }

});
