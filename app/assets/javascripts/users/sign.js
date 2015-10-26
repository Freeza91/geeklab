$(function () {

  // 初始化登录框
  if($('#sign').length > 0) {
    var loginVm = new Vue({
      el: '#signin',
      data: {
        rememberMe: true,
        hint: {
          email: '',
          password: ''
        },
        error: {
          email: false,
          password: false,
          login: false
        }
      },
      methods: {
        checkEmailFormat: checkEmailFormat,
        submit: login
      }
    });

    var registVm = new Vue({
      el: '#regist',
      data: {
        mailbox: '',
        countDown: 60,
        canSendCode: true,
        isPasswordFocus: false,
        hint: {
          email: '',
          code: '',
          password: '',
          regist: ''
        },
        error: {
          email: false,
          password: false,
          code: false,
          regist: false
        }
      },
      methods: {
        checkEmail: checkEmail,
        checkPasswordFormat: checkPasswordFormat,
        sendCode: sendCode,
        passwordFocus: passwordFocus,
        submit: regist
      }
    });


    $('#sign .close').on('click', function () {
      // 关闭窗口是清理状态
      loginVm.error = false;
      loginVm.rememberMe = true;
      for(key in registVm.error) {
        registVm.error[key] = false;
      }
      $('#sign [href="#login"]').click();
    });

    $('#sign [data-toggle="tab"]').on('click', function () {
      if($(this).attr('href') === '#signin') {
        $('#sign .triangle').removeClass('right').addClass('left');
      } else {
        $('#sign .triangle').removeClass('left').addClass('right');
      }
    });
  }

  function login(vm, event) {
    event.preventDefault();
    if(!checkLoginInfo(vm)) {
      return false;
    }
    clearHint(vm.hint);
    var data = {
      email: vm.email,
      encrypted_password: vm.password,
      remember_me: vm.rememberMe
    };
    $.ajax({
      url: '/users/sessions/auth',
      method: 'post',
      data: data
    })
    .done(function (data) {
      console.log(data);
      if(data.status === 0) {
        switch(data.code) {
          case 0:
            // 登录失败
            vm.error.email = true;
            vm.error.password = true;
            vm.error.login = true;
          break;
          case 1:
            // 登录成功, 进行跳转
            location.href = data.url;
          break;
        }
      }
    })
    .error(function (errors) {
      console.log(errors);
    });
  }

  function regist(vm, event) {
    event.preventDefault();
    if(!checkRegistInfo(vm)) {
      return false;
    }
    clearHint(vm.hint);
    var data = {
      email: vm.email,
      encrypted_password: vm.password,
      code: vm.code,
      role: 'both'
    };

    $.ajax({
      url: '/users/registrations',
      method: 'post',
      data: {user: data}
    })
    .done(function (data) {
      if(data.status === 0){
        if(data.code === 1) {
          // 注册成功
          location.href = "/assignments";
        } else {
          switch(data.code) {
            case 2:
              // 邮箱已被注册
              vm.hint.regist='邮箱已被注册，请重新输入';
              vm.error.regist = true;
              vm.error.email = true;
            break;
            case 3:
              // 验证码错误
              vm.hint.regist='验证码错误或过期';
              vm.error.regist = true;
              vm.error.code = true;
            break;
            case -1:
              // 注册频率限制
              vm.hint.regist='操作太频繁,请稍后再试';
              vm.error.regist = true;
            break;
          }
        }
      }
    })
    .error(function (erros) {
      console.log(errors);
    })
  }

  function sendCode (vm) {
    if(!vm.email || vm.email === '') {
      vm.hint.email = '请输入邮箱';
      vm.error.email = true;
      return false;
    }
    if(!Geeklab.formValueValid(vm.email, 'email')) {
      vm.hint.email = '邮箱格式错误';
      vm.error.email = true;
      return false;
    }
    if(!vm.canSendCode) {
      return false;
    }
    vm.canSendCode = false;
    var intervalId = setInterval(function () {
      vm.countDown--;
      if(vm.countDown === 0) {
        clearInterval(intervalId);
        vm.countDown = 60;
        vm.canSendCode = true;
      }
    }, 1000);
    $.ajax({
      url: '/users/mailers/send_confirmation',
      data: {email: vm.email}
    })
    .done(function (data) {
      if(data.status === 0 && data.code === 1) {
        if(data.email) {
          vm.mailbox = data.email
        }
      }
    })
    .error(function (errors) {
      console.log(errors);
    });
  }

  function checkLoginInfo (vm) {
    var email = vm.email,
        password = vm.password;
        validated = true;

    // 检查邮箱
    if(email) {
      if(!checkEmailFormat(vm)) {
        validated = false;
      }
    } else {
      vm.error.email = true;
      vm.hint.email = '请输入邮箱';
      validated = false;
    }

    // check password
    if(!password) {
      vm.error.password = true;
      validated = false;
    }
    return validated;
  }

  function checkRegistInfo (vm) {
    var email = vm.email,
        code = vm.code,
        password = vm.password,
        validated = true;

    // check email
    if(email) {
      if(!checkEmailFormat(vm)) {
        validated = false;
      }
    } else {
      vm.hint.email = '请输入邮箱';
      vm.error.email = true;
      validated = false;
    }

    // check code
    if(!code) {
       vm.error.code = true;
       vm.hint.code = '请输入验证码';
       validated = false;
    }

    // check password
    if(password) {
      if(!checkPasswordFormat(vm)) {
        validated = false;
      }
    } else {
      vm.hint.password = '请输入密码';
      vm.error.password = true;
      validated = false;
    }
    return validated;
  }

  function checkEmail (vm) {
    if(checkEmailFormat(vm)) {
      isEmailRegisted(vm);
    }
  }

  function checkEmailFormat (vm) {
    var email = vm.email;
    if(email && !Geeklab.formValueValid(email, 'email')) {
      vm.error.email = true;
      vm.hint.email = '邮箱格式错误';
      return false;
    }
    return true;
  }
  function checkPasswordFormat (vm) {
    vm.isPasswordFocus = false;

    var password = vm.password;
    if(password && !Geeklab.formValueValid(password, 'password')) {
      vm.error.password = true;
      vm.hint.password = '密码格式错误';
      return false;
    }
    return true;
  }
  function isEmailRegisted (vm) {
    var email = vm.email,
        validated = true;
    Geeklab.emailRegisted(email, function () {
      vm.hint.email = '邮箱已被注册';
      vm.error.email = true;
      validated = false;
    });
    return validated
  }

  function passwordFocus (vm) {
    vm.error.password = false;
    vm.isPasswordFocus = true;
  }

  function clearHint (hint) {
    for(key in hint) {
      if(hint.hasOwnProperty(key)) {
        hint[key] = '';
      }
    }
  }
});
