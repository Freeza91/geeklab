$(function () {
  // init slider & regist vue transition
  require('./project-init.js')();
  var projectBase = require('./project-base.js');

  var url = location.pathname,
      uploadUrl = '',
      vm;

  var checkMap = {
    city: ['一线城市', '省会城市', '其它']
  };

  Geeklab.showLoading();
  $.ajax({
    url: url,
    dataType: 'json'
  })
  .done(function (data, status) {
    if(data.status === 0 && data.code === 1) {
      uploadUrl = '/projects/' + data.project.id;
      vm = new Vue({
        el: '.project',
        data: generateVmData(data.project),
        methods: {
          transformSex: projectBase.transformSex,
          previousStep: projectBase.previousStep,
          nextStep: nextStep,
          addTask: projectBase.addTask,
          deleteTask: projectBase.deleteTask,
          addHotTask: projectBase.addHotTask,
          showHotTask: projectBase.showHotTask,
          toggleCheckAll: projectBase.toggleCheckAll,
          checkAllEffect: projectBase.checkAllEffect,
          uploadQrcode: uploadQrcode,
          localImageView: projectBase.localImageView,
          textareaLengthLimit: projectBase.textareaLengthLimit,
          submit: submit
        }
      });
      Geeklab.removeLoading();
    }
  })
  .error(function (errors, status) {
    console.log(errors);
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


  function generateVmData (project) {
    var incomeMap = [0, 2, 5, 8, 10, 15, 30, 50, 100];

    var vmData = {};
    vmData.step = 1;
    vmData.validated = {
      step_1: true,
      step_2: true,
      step_3: true,
      step_4: true
    };
    vmData.checkAll = {
      sex: true,
      city: true,
      education: true,
      emotion: true,
      orientation: true,
      interests: false
    };
    vmData.hasChecked = {
      sex: true,
      city: true,
      education: true,
      emotion: true,
      orientation: true,
      tasks: true
    };

    // 基本信息
    vmData.name = project.name;
    vmData.introduction = project.profile;
    vmData.device = project.device;

    // 区分web, app
    if(project.device === 'web') {
      vmData.website = project.platform
    } else {
      vmData.platform = project.platform;
    }

    // target user
    vmData.sex = generateVmCheckArr(['男', '女'], project.user_feature.sex);
    vmData.city = generateVmCheckArr(['北上广深', '省会城市', '其它'], project.user_feature.city_level, 'index');
    vmData.education = generateVmCheckArr(['高中及以下', '大专', '本科', '硕士', '博士'], project.user_feature.education);
    vmData.emotion = generateVmCheckArr(['单身', '恋爱中', '已婚'], project.user_feature.emotional_status);
    vmData.orientation = generateVmCheckArr(['异性恋', '同性恋', '双性恋'], project.user_feature.sex_orientation);
    vmData.interests = generateVmCheckArr(['足球', '健身', '旅游', '二次元', '音乐', '看书', '电影', '星座'], project.user_feature.interest);

    // task
    vmData.situation = project.desc;
    vmData.tasks = [];
    project.tasks.forEach(function (item) {
      vmData.tasks.push({
        id: item.id,
        content: item.content
      });
    });
    vmData.tasksLimited = false;
    vmData.showHotTasks = false;
    vmData.deletedTask = [];
    vmData.showHotTasks = false;

    // 联系方式
    vmData.mobile = {
      content: project.phone,
      validated: true
    };
    vmData.email = {
      content: project.email,
      validated: true
    };
    vmData.username = project.contact_name;
    vmData.company = project.company;

    // 设置使用slider选择的值
    $('#slider-age').val(project.user_feature.age.split('-'));
    var income = project.user_feature.income.split('-').map(function (item) {
      return incomeMap.indexOf(parseInt(item));
    });
    $('#slider-income').val(income);
    $('#slider-user').val(project.demand);
    // 是否全选
    for (key in vmData.checkAll) {
      vmData.checkAll[key] = isCheckAll(vmData[key]);
    }
    // 显示二维码图片
    if(project.qr_code) {
      $('.qrcode-preview img').attr('src', project.qr_code).show();
      vmData.qrcode = project.qr_code;
    }
    return vmData;
  }

  function generateVmCheckArr (cates, catesChecked, checkType) {
    var arr = [];
    if(checkType === 'index') {
      cates.forEach(function (item, index) {
        arr.push({
          key: item,
          checked: catesChecked.indexOf(index + 1) != -1
        })
      });
    } else {
      cates.forEach(function (item) {
        arr.push({
          key: item,
          checked: catesChecked.indexOf(item) != -1
        });
      });
    }
    return arr;
  }

  function isCheckAll (vmCheckArr) {
    return vmCheckArr.every(function (item){
      return item.checked;
    });
  }


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

    data.append('name', vmData.name);
    data.append('device', vmData.device);
    data.append('profile', vmData.introduction);

    var user_feature_attributes = {};
    user_feature_attributes.sex = projectBase.getVmCheckboxArr(vmData.sex);
    user_feature_attributes.city_level = projectBase.getVmCheckboxArr(vmData.city, 'index');
    user_feature_attributes.education = projectBase.getVmCheckboxArr(vmData.education);
    user_feature_attributes.emotional_status = projectBase.getVmCheckboxArr(vmData.emotion);
    user_feature_attributes.sex_orientation = projectBase.getVmCheckboxArr(vmData.orientation);
    user_feature_attributes.interest = projectBase.getVmCheckboxArr(vmData.interests);

    var tasks_attributes = {};
    var taskIndex = 0;
    vmData.tasks.forEach(function (task) {
      if(task.content.length > 0) {
        if(task.id) {
          tasks_attributes[taskIndex++] = {
            content: task.content,
            id:  task.id
          };
        } else {
          tasks_attributes[taskIndex++] = {content: task.content};
        }
      }
    });

    // 处理被删除的task
    vmData.deletedTask.forEach(function (taskId) {
      tasks_attributes[taskIndex++] = {
        id: taskId,
        _destroy: 1
      }
    });
    data.append('tasks_attributes', JSON.stringify(tasks_attributes));
    data.append('desc', vmData.situation);

    data.append('contact_name', vmData.username);
    data.append('phone', vmData.mobile.content);
    data.append('email', vmData.email.content);
    data.append('company', vmData.company);

    var userCount = $('#slider-user').val();
    var age = $('#slider-age').val();
    var income = $('#slider-income').val();
    var sys = (vmData.platform === 'ios' ? $('#slider-ios').val() : $('#slider-android').val());

    data.append('demand', userCount);
    user_feature_attributes.age = age.join('-');
    user_feature_attributes.income = income.join('-');
    data.append('user_feature_attributes', JSON.stringify(user_feature_attributes));

    // 区分web, app
    if(vmData.device === 'web') {
      data.append('platform', vmData.website);
      data.append('requirement', 'all');
    } else {
      data.append('platform', vmData.platform);
      data.append('requirement', sys);
      data.append('qr_code', vmData.qrcode);
    }

    Geeklab.showLoading();
    $.ajax({
      url: uploadUrl,
      method: 'put',
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
        if(vm.device === 'web') {
          if(vm.website && vm.introduction) {
            vm.validated.step_1 = true;
            vm.step++;
          } else {
            vm.validated.step_1 = false;
          }
        } else {
          if(vm.introduction && vm.qrcode) {
            vm.validated.step_1 = true;
            projectBase.scrollToTop(0, 0);
            vm.step++;
          } else {
            vm.validated.step_1 = false;
          }
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

  // 上传二维码
  function uploadQrcode (event) {
    event.preventDefault();
    $('[name="qrcode"]').click();
  }

});
