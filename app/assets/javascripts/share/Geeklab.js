$(function () {
  var Geeklab = window.Geeklab || {};

  Geeklab.formValueValid = function (value, type) {
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

  Geeklab.emailRegisted = function (email, callback) {
    $.ajax({
      url: '/users/registrations/is_emails_exist',
      data: {email: email}
    })
    .done(function (data, status, xhr) {
      if(data.status === 0) {
        switch(data.code) {
          case 0:
            // 已被注册
            if(callback !== undefined) {
              callback();
            }
          break;
          case 1:
            // 未被注册
          break;
        }
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });
  }

  window.Geeklab = Geeklab;
});
