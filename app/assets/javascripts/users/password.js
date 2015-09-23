$(function () {
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
        checkEmail: checkEmail,
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
        countDown: 5,
        redirect: ''
      },
      methods: {
        submit: resetPassword
      }
    })
  }

  function checkEmail (vm) {
    var email = vm.email;
    if(email) {
      if(!formValid(email, 'email')) {
        vm.hint = '邮箱格式错误';
        vm.error = true;
        return false;
      }
    }
    return true;
  }

  function formValid (value, type) {
    var result;
    switch(type){
      case 'email':
        var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
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
    if(!vm.email) {
      vm.hint = '请输入邮箱';
      vm.error = true;
      return false;
    }
    if(!checkEmail(vm) || !vm.canSendEmail) {
      return false;
    }

    vm.canSendEmail = false;
    vm.error = false;
    vm.hint = '';

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
            vm.canSendEmail = true;
          break;
          case 1:
            // 发送成功
            var intervalId = setInterval(function () {
              vm.countDown--;
              if(vm.countDown === 0) {
                clearInterval(intervalId);
                vm.countDown = 60;
                vm.canSendEmail = true;
              }
            }, 1000);
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
    event.preventDefault();

    if(!vm.password) {
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
      vm.success = true;
      vm.redirect = data.redirect_to;
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

  function emailRegisted(email, callback) {
    $.ajax({
      url: '/users/registrations/is_emails_exist',
      data: {email: email}
    })
    .done(function (data, status, xhr) {
      if(data.status === 0) {
        switch(data.code) {
          case 0:
            // 已被注册
          break;
          case 1:
            // 未被注册
            if(callback !== undefined) {
              callback();
            }
          break;
        }
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });
  }
});
