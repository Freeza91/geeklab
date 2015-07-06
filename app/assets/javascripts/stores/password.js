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
