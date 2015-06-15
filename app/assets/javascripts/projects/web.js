$(function () {
  if(!$('body').hasClass('projects_web')) {
    return false;
  }

  var vm = new Vue({
    el: '.project',
    data: {
      step: 1,
      validated: {
        step_1: true,
        step_2: true,
        step_3: true,
        step_4: true
      },
      checkAll: {
        sex: true,
        city: true,
        education: true,
        emotion: true,
        orientation: true,
        interests: false
      },
      hasChecked: {
        sex: true,
        city: true,
        education: true,
        emotion: true,
        orientation: true
      },
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
      deleteTask: deleteTask,
      toggleCheckAll: toggleCheckAll,
      checkAllEffect: checkAllEffect,
      submit: submit
    }
  });

  function submit(event) {
    event.preventDefault();

    if(vm.name && vm.username && vm.mobile && vm.email && vm.company) {
      vm.step_4 = true;
      postData();
    } else {
      vm.validated.step_4 = false;
      return false;
    }
  }

  function postData () {
    //var data = {};
    var data = new FormData();
    var vmData = vm.$data;

    // 不存在的数据，为了统一
    //data.device = 'web';
    //data.requirement = "all";
    data.append('device', 'web');
    data.append('requirement', 'all');

    // 获取数据
    // project basic info
    //data.name = vmData.name;
    //data.platform = vmData.website;
    //data.profile = vmData.introduction;
    data.append('name', vmData.name);
    data.append('platform', vmData.website);
    data.append('profile', vmData.introduction);

    // target user requirement
    //data.user_feature_attributes = {};
    //data.user_feature_attributes.sex = getVmCheckboxArr(vmData.sex);
    //data.user_feature_attributes.city_level = getVmCheckboxArr(vmData.city, 'index');
    //data.user_feature_attributes.education = getVmCheckboxArr(vmData.education);
    //data.user_feature_attributes.emotional_status = getVmCheckboxArr(vmData.emotion);
    //data.user_feature_attributes.sex_orientation = getVmCheckboxArr(vmData.orientation);
    //data.user_feature_attributes.interest = getVmCheckboxArr(vmData.interests);
    var user_feature_attributes = {};
    user_feature_attributes.sex = getVmCheckboxArr(vmData.sex);
    user_feature_attributes.city_level = getVmCheckboxArr(vmData.city, 'index');
    user_feature_attributes.education = getVmCheckboxArr(vmData.education);
    user_feature_attributes.emotional_status = getVmCheckboxArr(vmData.emotion);
    user_feature_attributes.sex_orientation = getVmCheckboxArr(vmData.orientation);
    user_feature_attributes.interest = getVmCheckboxArr(vmData.interests);

    // tasks
    //data.desc = vmData.situation;
    //data.tasks_attributes = [];
    //vmData.tasks.forEach(function (task) {
      //data.tasks_attributes.push({
        //content: task.content
      //});
    //});
    //var tasks_attributes = [];
    //vmData.tasks.forEach(function (task) {
      //tasks_attributes.push({
        //content: task.content
      //});
    //});
 
    var tasks_attributes = {};
    vmData.tasks.forEach(function (task, index) {
      tasks_attributes[index] = {content: task.content};
    });
    data.append('tasks_attributes', JSON.stringify(tasks_attributes));
    data.append('desc', vmData.situation);

    // contact info
    //data.contact_name = vmData.username;
    //data.phone = vmData.mobile;
    //data.email= vmData.email;
    //data.company = vmData.company;
    data.append('contact_name', vmData.username);
    data.append('phone', vmData.mobile);
    data.append('email', vmData.email);
    data.append('company', vmData.company);

    var userCount = $('#slider-user').val();
    var age = $('#slider-age').val();
    var income = $('#slider-income').val();

    //data.demand = userCount;
    //data.user_feature_attributes.age = age.join('-');
    //data.user_feature_attributes.income = income.join('-');

    data.append('demand', userCount);
    user_feature_attributes.age = age.join('-');
    user_feature_attributes.income = income.join('-');
    data.append('user_feature_attributes', JSON.stringify(user_feature_attributes));

    console.log(data);

    var url = '/projects';
    $.ajax({
      url: url,
      method: 'post',
      //data: {project: data}
      data: data,
      cache: false,
      processData: false, //Dont't process the file
      contentType: false,
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        location.href = '/projects'
      }
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
    return false;
  }
  function nextStep (event) {
    event.preventDefault();
    switch(vm.step) {
      case 1:
        if(vm.website && vm.introduction) {
          vm.validated.step_1 = true;
          vm.step++;
        } else {
          vm.validated.step_1 = false;
        }
      break;
      case 2:
        var cates = ['sex', 'city', 'education', 'emotion', 'orientation'];
        vm.validated.step_2 = cates.every(function (cate) {
          vm.hasChecked[cate] = vm[cate].every(isCheck);
          return vm.hasChecked[cate];
        });
        if(vm.validated.step_2) {
          vm.step++;
        }
      break;
      case 3:
        if(vm.situation && vm.tasks[0].content) {
          vm.validated.step_3 = true;
          vm.step++;
        } else {
          vm.validated.step_3 = false;
        }
      break;
    }
    return false;
  }
  function addTask (event) {
    event.preventDefault();
    vm.tasks.push({
      content: ''
    });
    updateSort();
  }

  function deleteTask (task, event) {
    event.preventDefault();
    vm.tasks.$remove(task.$index);
  }

  function toggleCheckAll (category) {
    var checkbox = vm[category];
    if(vm.checkAll[category]) {
      checkbox.forEach(function (item) {
        item.checked = true;
      });
    } else {
      checkbox.forEach(function (item) {
        item.checked = false;
      });
    }
  }

  function checkAllEffect (category, currChecked) {
    if(!currChecked) {
      vm.checkAll[category] = false;
    } else {
      var checkbox = vm[category];
      if(checkbox.every(isCheck)) {
        vm.checkAll[category] = true;
      }
    }
  }

  function isCheck(item) {
    return item.checked;
  }
  // init task sortable
  function initSortable () {
    $('.sortable').sortable({
      handle: '.drag-handle'
    });
  }
  initSortable ();

  // 动态插入task之后的拖动
  function updateSort () {
    $('.sortable').on('DOMNodeInserted', function () {
      initSortable();
      $('.sortable').unbind('DOMNodeInserted');
    });
  }

});
