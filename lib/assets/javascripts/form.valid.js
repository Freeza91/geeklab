// form valid
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

function emailValid(email, $el) {
  var $root = $el.parents('.form-group');
  // 清理目前显示的提示信息
  $root.removeClass('has-success has-error').find('.glyphicon-ok').addClass('sr-only');
  $root.find('.form-control-feedback.text').text('');
  if(email === '') {
    $root.addClass('has-error').find('.form-control-feedback.text').text('请输入邮箱');
    return false;
  }
  if(!formValid(email, 'email')) {
    $root.addClass('has-error').find('.form-control-feedback.text').text('邮箱格式错误');
    return false;
  }
  return true;
}
function emailRegisted(email, $el, callback, errorHandle, errorParam) {
  var $root = $el.parents('.form-group');
    $.ajax({
      url: '/users/registrations/is_emails_exist',
      data: {email: email}
    })
    .done(function (data, status, xhr) {
      if(data.status === 0) {
        switch(data.code) {
          case 0:
            // 不可用，已被注册
            $root.addClass('has-error').find('.form-control-feedback.text').text('邮箱已注册');
            if(typeof errorHandle !== 'undefined') {
              errorHandle(errorParam);
            }
          break;
          case 1:
            // 可用
            $root.addClass('has-success').find('.glyphicon-ok').removeClass('sr-only');
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
function passwordValid(password, $el) {

  var $root = $el.parents('.form-group');
  // 清理目前显示的提示信息
  $root.removeClass('has-success has-error').find('.glyphicon-ok').addClass('sr-only');
  $root.find('.form-control-feedback.text').text('');
  if(password === '') {
    $root.addClass('has-error').find('.form-control-feedback.text').text('请输入密码');
    return false;
  }
  if(!formValid(password, 'password')) {
    $root.addClass('has-error').find('.form-control-feedback.text').text('格式错误');
    return false;
  }
  return true;
}

function mobileValid (mobile, $el) {
  var $root = $el.parents('.form-group');
  // 清理目前显示的提示信息
  $root.removeClass('has-success has-error');
  $root.find('.form-control-feedback.text').text('');
  if(mobile === '') {
    $root.addClass('has-error').find('.form-control-feedback.text').text('请输入手机号');
    return false;
  }
  if(!formValid(mobile, 'mobile_phone')) {
    $root.addClass('has-error').find('.form-control-feedback.text').text('格式错误');
    return false;
  }
  return true;
}

$('.input-valid').on('blur', function (event) {
  var $this = $(this);
  var $root = $this.parents('.form-group');
  var $form = $this.parents('form');
  var value = $this.val();
  var type = $this.attr('type');
  var result = true;
  if(type === 'text') {
    type = $this.data('infoName');
  }
  if(value.length == 0 || type === 'text') {
    return false;
  }
  switch(type) {
    case 'mobile_phone':
      console.log(value);
      result = mobileValid(value, $this);
    break;
    default:
      result = formValid(value, type);
    break;
  }
  if(result) {
    if($root.hasClass('has-error')) {
      $root.removeClass('has-error');
      $root.find('.glyphicon-remove').addClass('sr-only')
    }
    $root.addClass('has-success');
    $root.find('.glyphicon-ok').removeClass('sr-only')
  } else {
    if($root.hasClass('has-success')) {
      $root.removeClass('has-success');
      $root.find('.glyphicon-ok').addClass('sr-only')
    }
    $root.addClass('has-error');
    $root.find('.glyphicon-remove').removeClass('sr-only')
  }
  //enableSubmit($form);
});
