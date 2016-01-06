$(function () {
  if(!$('body').hasClass('projects_edit')) {
    return false;
  }

  var url = location.pathname,
      uploadUrl = '',
      vm,
      qrcode;

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
          transformSex: transformSex,
          previousStep: previousStep,
          nextStep: nextStep,
          addTask: addTask,
          deleteTask: deleteTask,
          addHotTask: addHotTask,
          showHotTask: showHotTask,
          toggleCheckAll: toggleCheckAll,
          checkAllEffect: checkAllEffect,
          uploadQrcode: uploadQrcode,
          localImageView: localImageView,
          textareaLengthLimit: textareaLengthLimit,
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
    console.log(vmData);
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
      vm.mobile.validated = inputValid(vm.mobile.content, 'mobile_phone');
    }
    if(vm.email.content) {
      vm.email.validated = inputValid(vm.email.content, 'email');
    }

    if(vm.name && vm.username && vm.mobile.validated && vm.email.validated && vm.company) {
      vm.step_4 = true;
      postData();
    } else {
      if (!vm.name) {
        scrollToTop(0);
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
    user_feature_attributes.sex = getVmCheckboxArr(vmData.sex);
    user_feature_attributes.city_level = getVmCheckboxArr(vmData.city, 'index');
    user_feature_attributes.education = getVmCheckboxArr(vmData.education);
    user_feature_attributes.emotional_status = getVmCheckboxArr(vmData.emotion);
    user_feature_attributes.sex_orientation = getVmCheckboxArr(vmData.orientation);
    user_feature_attributes.interest = getVmCheckboxArr(vmData.interests);

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
      qrcode ? data.append('qr_code', qrcode) : data.append('qr_code', vmData.qrcode);
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

  function transformSex (sex) {
    var sexMap = {
      '男': 'male',
      '女': 'female'
    };
    return sexMap[sex];
  }

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

  function localImageView (event) {
    var input = event.target;
    qrcode = input.files[0];
    vm.qrcode = input.value;
    var url = window.URL.createObjectURL(qrcode);
    input.value = '';
    $('.qrcode-preview img').attr('src', url);
  }

  function previousStep (event) {
    event.preventDefault();
    scrollToTop(0, 0);
    vm.step--;
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
            scrollToTop(0, 0);
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
          vm.hasChecked[cate] = vm[cate].some(isCheck);
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
          scrollToTop(0, 0);
        } else {
          var topPoint = $('.step-2').find('.project-panel').eq(firstErrorIndex + 3).position().top;
          scrollToTop(topPoint - 100);
        }
      break;
      case 3:
        vm.hasChecked.tasks = vm.tasks.some(isTaskFilled);
        if(vm.situation && vm.hasChecked.tasks) {
          vm.validated.step_3 = true;
          vm.step++;
          scrollToTop(0, 0);
        } else {
          vm.validated.step_3 = false;
          scrollToTop(0);
        }
      break;
    }
    return false;
  }

  function isTaskFilled (task) {
    return task.content.length > 0
  }

  function addTask (event, taskContent) {
    event.preventDefault();
    if(vm.tasks.length < 5) {
      vm.tasks.push({
        content: taskContent || ''
      });
    } else {
      vm.tasksLimited = true;
      setTimeout(function () {
        vm.tasksLimited = false;
      }, 2000);
    }
  }

  function deleteTask (task, event) {
    event.preventDefault();
    vm.tasks.$remove(task.$index);
    if(task.id) {
      vm.deletedTask.push(task.id);
    }
  }

  function addHotTask (vm, event) {
    event.preventDefault();
    var taskContent = event.target.innerText;
    addTask(event, taskContent);
  }

  function showHotTask (vm, event) {
    event.preventDefault();
    if(!vm.showHotTasks) {
      vm.showHotTasks = true;
    }
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

  // 上传二维码
  function uploadQrcode (event) {
    event.preventDefault();
    $('[name="qrcode"]').click();
  }

  function inputValid (value, type) {
    var result;
    switch(type){
      case 'email':
        var emailReg = /^(\w)+(\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        result = emailReg.test(value);
      break;
      case 'mobile_phone':
        var mobileReg = /^1[3|5|7|8][0-9]{9}$/;
        result = mobileReg.test(value);
        break;
    }
    return result;
  }

  function textareaLengthLimit (modelName, event, lengthLimit) {
    var el = event.target;
    var value = el.value;
    var len = value.length;
    if(len < lengthLimit) {
      return true;
    } else {
      if(modelName === 'situation') {
        vm.situation = value.substr(0, lengthLimit);
      } else {
        vm.tasks[modelName].content = value.substr(0, lengthLimit);
      }
      event.returnValue = false;
    }
  };

  function scrollToTop (topPoint, duration) {
    if(duration === 0) {
      $('html, body').scrollTop(0);
    } else {
      $('html, body').animate({
        scrollTop: topPoint,
      }, duration || 800);
    }
  }

});
