$(function () {
  if(!$('body').hasClass('projects_app')) {
    return false;
  }
  var qrcode;
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
      name: '',
      introduction: '',
      platform: 'ios',
      device: 'phone',
      situation: '',
      username: '',
      company: '',
      qrcode: '',
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
          key: '北上广深',
          checked: true
        },
        {
          key: '省会城市',
          checked: true
        },
        {
        key: '其它',
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
      tasksLimited: false
    },
    methods: {
      transformSex: transformSex,
      previousStep: previousStep,
      nextStep: nextStep,
      addTask: addTask,
      deleteTask: deleteTask,
      toggleCheckAll: toggleCheckAll,
      checkAllEffect: checkAllEffect,
      uploadQrcode: uploadQrcode,
      localImageView: localImageView,
      textareaLengthLimit: textareaLengthLimit,
      submit: submit
    }
  });

  function submit(event) {
    event.preventDefault();
    console.log('submit');

    vm.mobile.validated = inputValid(vm.mobile.content, 'mobile_phone');
    vm.email.validated = inputValid(vm.email.content, 'email');
    if(vm.name && vm.username && vm.mobile.validated && vm.email.validated && vm.company) {
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

    data.append('name', vmData.name);
    data.append('platform', vmData.platform);
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
    vmData.tasks.forEach(function (task, index) {
      if(task.content.length > 0) {
        tasks_attributes[index] = {content: task.content};
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

    data.append('demand', userCount);
    data.append('requirement', 'all');
    user_feature_attributes.age = age.join('-');
    user_feature_attributes.income = income.join('-');
    data.append('user_feature_attributes', JSON.stringify(user_feature_attributes));

    data.append('qr_code', qrcode)
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

  /*
   * @param valueType 返回值的类型
   */
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
    scrollToTop();
    vm.step--;
  }
  function nextStep (event) {
    event.preventDefault();
    switch(vm.step) {
      case 1:
        if(vm.introduction && qrcode) {
          vm.validated.step_1 = true;
          vm.step++;
          scrollToTop();
        } else {
          vm.validated.step_1 = false;
        }
      break;
      case 2:
        var cates = ['sex', 'city', 'education', 'emotion', 'orientation'];
        vm.validated.step_2 = cates.every(function (cate) {
          vm.hasChecked[cate] = vm[cate].some(isCheck);
          return vm.hasChecked[cate];
        });
        if(vm.validated.step_2) {
          vm.step++;
          scrollToTop();
        }
      break;
      case 3:
        if(vm.situation && vm.tasks[0].content) {
          vm.validated.step_3 = true;
          vm.step++;
          scrollToTop();
        } else {
          vm.validated.step_3 = false;
        }
      break;
    }
    return false;
  }
  function addTask (event) {
    event.preventDefault();
    if(vm.tasks.length < 8) {
      vm.tasks.push({
        content: ''
      }); } else {
      vm.tasksLimited = true;
      setTimeout(function () {
        vm.tasksLimited = false;
      }, 2000);
    }
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

  // 上传二维码
  function uploadQrcode (event) {
    event.preventDefault();
    $('[name="qrcode"]').click();
  }

  function inputValid (value, type) {
    var result;
    switch(type){
      case 'email':
        var emailReg = /^[0-9a-zA-Z_-]+@([0-9a-zA-Z]+.)+[a-zA-Z]$/;
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

  function scrollToTop () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

});
