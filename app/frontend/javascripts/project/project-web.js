$(function () {
  // init slider & regist vue transition
  require('./project-init.js')();
  var projectBase = require('./project-base.js');

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
        orientation: true,
        tasks: true
      },
      name: '',
      website: '',
      introduction: '',
      situation: '',
      username: '',
      company: '',
      mobile: {
        content: '',
        validated: true
      },
      email: {
        content: '',
        validated: true
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
      ],
      tasksLimited: false,
      showHotTasks: false
    },
    methods: {
      transformSex        : projectBase.transformSex,
      previousStep        : projectBase.previousStep,
      nextStep            : nextStep,
      addTask             : projectBase.addTask,
      deleteTask          : projectBase.deleteTask,
      addHotTask          : projectBase.addHotTask,
      showHotTask         : projectBase.showHotTask,
      toggleCheckAll      : projectBase.toggleCheckAll,
      checkAllEffect      : projectBase.checkAllEffect,
      textareaLengthLimit : projectBase.textareaLengthLimit,
      submit              : submit
    }
  });
  // init sortable task list
  var sortEl = document.getElementById('task-list');
  var sortable = Sortable.create(sortEl, {
    handle: '.drag-handle',
    onEnd: function (evt) {
      var oldIndex = evt.oldIndex,
          newIndex = evt.newIndex;
      if(oldIndex !== newIndex) {
        // 更改数据位置
        var task = vm.tasks.splice(oldIndex, 1)[0];
        vm.tasks.splice(newIndex, 0, task);
      }
    }
  });

  function submit(event) {
    event.preventDefault();
    if(vm.mobile.content) {
      vm.mobile.validated = Geeklab.formValueValid(vm.mobile.content, 'mobile_phone');
    }
    if(vm.email.content) {
      vm.email.validated = Geeklab.formValueValid(vm.email.content, 'email');
    }

    if(vm.name && vm.username && vm.mobile.validated && vm.email.validated && vm.company) {
      vm.step_4 = true;
      postData();
    } else {
      if (!vm.name) {
        projectBase.scrollToTop(0);
      }
      vm.validated.step_4 = false;
      return false;
    }
  }

  function postData () {
    var data = new FormData();
    var vmData = vm.$data;

    // 不存在的数据，为了统一
    data.append('device', 'web');
    data.append('requirement', 'all');

    // 获取数据
    data.append('name', vmData.name);
    data.append('platform', vmData.website);
    data.append('profile', vmData.introduction);

    // target user requirement
    var user_feature_attributes = {};
    user_feature_attributes.sex = projectBase.getVmCheckboxArr(vmData.sex);
    user_feature_attributes.city_level = projectBase.getVmCheckboxArr(vmData.city, 'index');
    user_feature_attributes.education = projectBase.getVmCheckboxArr(vmData.education);
    user_feature_attributes.emotional_status = projectBase.getVmCheckboxArr(vmData.emotion);
    user_feature_attributes.sex_orientation = projectBase.getVmCheckboxArr(vmData.orientation);
    user_feature_attributes.interest = projectBase.getVmCheckboxArr(vmData.interests);


    var tasks_attributes = {};
    vmData.tasks.forEach(function (task, index) {
      if(task.content.length > 0) {
        tasks_attributes[index] = {content: task.content};
      }
    });
    data.append('tasks_attributes', JSON.stringify(tasks_attributes));
    data.append('desc', vmData.situation);

    // contact info
    data.append('contact_name', vmData.username);
    data.append('phone', vmData.mobile.content);
    data.append('email', vmData.email.content);
    data.append('company', vmData.company);

    var userCount = $('#slider-user').val();
    var age = $('#slider-age').val();
    var income = $('#slider-income').val();

    data.append('demand', userCount);
    user_feature_attributes.age = age.join('-');
    user_feature_attributes.income = income.join('-');
    data.append('user_feature_attributes', JSON.stringify(user_feature_attributes));

    console.log(data);

    var url = '/projects';
    $.ajax({
      url: url,
      method: 'post',
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
        var cates = ['sex', 'city', 'education', 'emotion', 'orientation'],
            firstErrorIndex = 0;
        cates.forEach(function (cate) {
          vm.hasChecked[cate] = vm[cate].some(projectBase.isCheck);
          return vm.hasChecked[cate];
        });
        vm.validated.step_2 = cates.every(function (cate, index) {
          if(!cate) {
            firstErrorIndex = index;
          }
          return vm.hasChecked[cate];
        });
        if(vm.validated.step_2) {
          vm.step++;
          projectBase.scrollToTop(0, 0);
        } else {
          var topPoint = $('.step-2').find('.project-panel').eq(firstErrorIndex + 3).position().top;
          projectBase.scrollToTop(topPoint - 100);
        }
      break;
      case 3:
        vm.hasChecked.tasks = vm.tasks.some(projectBase.isTaskFilled);
        if(vm.situation && vm.hasChecked.tasks) {
          vm.validated.step_3 = true;
          vm.step++;
          projectBase.scrollToTop(0, 0);
        } else {
          vm.validated.step_3 = false;
          projectBase.scrollToTop(0);
        }
      break;
    }
    return false;
  }
});
