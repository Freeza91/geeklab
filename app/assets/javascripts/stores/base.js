$(function () {
  
  // 初始化登录框
  if($('#sign').length > 0) {
    var loginVm = new Vue({
      el: '#login',
      data: {
        error: false,
        rememberMe: true
      },
      methods: {
        submit: login
      }
    });

    var registVm = new Vue({
      el: '#regist',
      data: {
        hint: '',
        mailbox: '',
        countDown: 60,
        canSendCode: true,
        error: {
          email: false,
          password: false,
          code: false,
          regist: false
        }
      },
      methods: {
        sendCode: sendCode,
        submit: regist
      }
    });

    // 忘记密码
    if($('body').hasClass('passwords_reset')) {
      var vm = new Vue({
        el: '#send-email',
        data: {
          mailbox: '',
          error: false,
          success: false,
          countDown: 60,
          hint: '',
          canSendEmail: true,
        },
        methods: {
          submit: sendEmail
        }
      });
    }

    // 重置密码
    if($('body').hasClass('passwords_edit_reset')) {
      var vm = new Vue({
        el: '#reset',
        data: {
          success: false,
          error: false,
          hint: '',
          countDown: 5
        },
        methods: {
          submit: resetPassword
        }
      })
    }

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
      if($(this).attr('href') === '#login') {
        $('#sign .triangle').removeClass('right').addClass('left');
      } else {
        $('#sign .triangle').removeClass('left').addClass('right');
      } 
    });
  }

  function login(vm, event) {
    event.preventDefault();
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
            vm.error = true;
          break;
          case 1:
            // 登录成功
            location.reload();
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
    if(!vm.email || vm.email === '') {
      console.log(vm.email);
      vm.hint = '请输入邮箱';
      vm.error.email = true;
      vm.error.regist = true;
      return false;
    }
    if(!formValid(vm.email, 'email')) {
      vm.hint = '邮箱格式错误';
      vm.error.email = true;
      vm.error.regist = true;
      return false;
    }
    if(!formValid(vm.password, 'password')) {
      vm.error.password = true;
      return false;
    }
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
        switch(data.code) {
          case 1:
            // 注册成功 
            location.reload();
          break;
          case 2:
            // 邮箱已被注册
            vm.hint='邮箱已被注册，请重新输入';
            vm.error.regist = true;
            vm.error.email = true;
          break;
          case 3:
            // 验证码错误
            vm.hint='验证码错误或过期';
            vm.error.regist = true;
            vm.error.code = true;
          break;
        }
      }
    })
    .error(function (erros) {
      console.log(errors);
    })
  }

  function sendCode (vm) {
    if(!vm.email || vm.email === '') {
      vm.hint = '请输入邮箱';
      vm.error.regist = true;
      return false;
    }
    if(!formValid(vm.email, 'email')) {
      vm.hint = '邮箱格式错误,请重新输入'; 
      vm.error.regist = true;
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

  function formValid (value, type) {
    var result;
    switch(type){
      case 'email':
        var emailReg = /^[0-9a-zA-Z_-]+@([0-9a-zA-Z]+.)+[a-zA-Z]$/;
        result = emailReg.test(value);
      break; 
      case 'password':
        var passwordReg = /[0-9a-zA-Z_]{6,16}/;
        result = passwordReg.test(value);
      break;
      case 'mobile_phone':
        var mobileReg = /^1[3|5|7|8][0-9]{9}$/;
        result = mobileReg.test(value);
        break;
      case 'required':
        result = (value.length > 0);
        break;
    }
    return result;
  }

  function sendEmail (vm, event) {
    event.preventDefault();
    if(!vm.canSendEmail) {
      return false;
    }
    if(!vm.email || vm.email === '') {
      vm.hint = '请输入邮箱';
      vm.error = true;
      return false;
    }
    if(!formValid(vm.email, 'email')) {
      vm.hint = '邮箱格式错误';
      vm.error = true;
      return false;
    }
    
    vm.canSendEmail = false;
    vm.error = false;
    var intervalId = setInterval(function () {
      vm.countDown--;
      if(vm.countDown === 0) {
        clearInterval(intervalId);
        vm.countDown = 60;
        vm.canSendEmail = true;
      }
    }, 1000);

    $.ajax({
      url: '/users/mailers/send_reset_password',
      method: 'post',
      data: {email: vm.email}
    })
    .done(function (data) {
      if(data.status === 0) {
        switch(data.code) {
          case 0:
            // 邮箱未注册
            vm.hint = '此邮箱未注册';
            vm.error = true;
          break;
          case 1:
            // 发送成功
          if(data.msg !== '') {
            vm.mailbox = data.msg
          }
          vm.success = true;
          break;
        }
      }
    })
    .error(function (errors) {
      console.log(errors);
    });
  }

  function resetPassword (vm, event) {
    console.log('xx');
    event.preventDefault();

    if(!vm.password || vm.password === '') {
      vm.hint = '请输入新密码';
      vm.error = true;
      return false;
    }
    if(!formValid(vm.password, 'password')) {
      vm.hint = '密码格式错误';
      vm.error = true;
      return false;
    }
    vm.error = false;
    var user = {
      encrypted_password: vm.password
    };
    $.ajax({
      url: '/users/passwords/update_reset',
      method: 'put',
      data: {user: user}
    })
    .done(function (data) {
      console.log(data);
      vm.success = true;
      var intervalId = setInterval(function () {
        vm.countDown--;
        if(vm.countDown === 0) {
          clearInterval(intervalId);
          location.href = data.redirect_to;
        }
      }, 1000);
    })
    .error(function (errors) {
      console.log(errors);
    })
  }
});