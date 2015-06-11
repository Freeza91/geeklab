$(function () {
  if(!$('body').hasClass('projects_web')) {
    return false;
  }

  var vm = new Vue({
    el: '.project',
    data: {
      step: 1,
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
      addTask: addTask,
      submit: submit
    }
  });
  
  $('.getvalue').on('click', submit);

  function submit(event) {
    event.preventDefault();

    var data = {};
    var vmData = vm.$data;

    // 不存在的数据，为了统一
    data.platform = data.device = 'web';
    data.requirement = "all";
    // 获取数据
    // project basic info
    data.name = vmData.name;
    data.website = vmData.website;
    data.profile = vmData.introduction;
    
    // target user requirement
    data.user_feature_attributes = {};
    data.user_feature_attributes.sex = getVmCheckboxArr(vmData.sex);
    data.user_feature_attributes.city_level = getVmCheckboxArr(vmData.city, 'index');
    data.user_feature_attributes.education = getVmCheckboxArr(vmData.education);
    data.user_feature_attributes.emotion_status = getVmCheckboxArr(vmData.emotion);
    data.user_feature_attributes.sex_orientation = getVmCheckboxArr(vmData.orientation);
    data.user_feature_attributes.interests = getVmCheckboxArr(vmData.interests);

    // tasks
    data.desc = vmData.situation;
    data.tasks_attributes = [];
    vmData.tasks.forEach(function (task) {
      data.tasks_attributes.push({
        content: task.content
      });
    });

    // contact info
    data.contact_name = vmData.username;
    data.mobile = vmData.mobile;
    data.email= vmData.email;
    data.company = vmData.company;
 
    var userCount = $('#slider-user').val();
    var age = $('#slider-age').val();
    var income = $('#slider-income').val();
    data.demand = userCount;
    data.age = age.join('-');
    data.income = income.join('-');

    console.log(data);
    
    var url = '/projects';
    $.ajax({
      url: url,
      method: 'post',
      data: {project: data}
    })
    .done(function (data, status) {

    })
    .error(function (errors, status) {
      console.log(errors);
    });
  }

  /* 
   * @param valueType 返回值的类型
   */
  function getVmCheckboxArr (vmArr, valueType) {
    valueType = valueType || 'value';
    var result = [];
    switch(valueType) {
      case 'index': 
        vmArr.forEach(function (item, index) {
          if(item.checked) {
            result.push(index + 1);
          }
        });
      break;
      case 'value':
        vmArr.forEach(function (item) {
          if(item.checked) {
            result.push(item.key);
          }
        });
      break;
    }
    return result;
  }

  // 操作相关的函数
  function previousStep (event) {
    event.preventDefault();
    vm.step--;
  }
  function nextStep (event) {
    event.preventDefault();
    vm.step++;
  }
  function addTask (event) {
    event.preventDefault();
    vm.tasks.push({
      content: ''
    });
  }
});
