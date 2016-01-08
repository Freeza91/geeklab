var Geeklab = module.exports = {};

Geeklab.formValueValid = function (value, type) {
  var result;
  switch(type){
    case 'email':
      //var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
      var emailReg = /^(\w)+(\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
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
};

Geeklab.emailValid = function (email, $el) {
  var $root = $el.parents('.form-group');
  // 清理目前显示的提示信息
  $root.removeClass('has-success has-error').find('.glyphicon-ok').addClass('sr-only');
  $root.find('.form-control-feedback.text').text('');
  if(email === '') {
    $root.addClass('has-error').find('.form-control-feedback.text').text('请输入邮箱');
    return false;
  }
  if(!Geeklab.formValueValid(email, 'email')) {
    $root.addClass('has-error').find('.form-control-feedback.text').text('邮箱格式错误');
    return false;
  }
  return true;
};

Geeklab.addMask = function () {
  $('body').append('<div class="main-mask"></div>');
}

Geeklab.removeMak = function () {
  $('body .main-mask').remove();
}

Geeklab.showLoading = function () {
  Geeklab.addMask();
  $('body').append('<div class="jar">'
                   + '<div class="mouth"></div>'
                   + '<div class="neck"></div>'
                   + '<div class="base">'
                   + '<div class="liquid"></div>'
                   + '<div class="wave"></div>'
                   + '<div class="wave"></div>'
                   + '<div class="bubble"></div>'
                   + '<div class="bubble"></div>'
                   + '</div>'
                   + '<div class="bubble"></div>'
                   + '<div class="bubble"></div>'
                   + '</div>');
}

Geeklab.removeLoading = function () {
  $('body .jar').remove();
  Geeklab.removeMak();
};

Geeklab.showConfirmModal = function (options) {
  var $modal = $(options.modal);
  $modal.data('eventName', options.eventName);
  $modal.find('.content').text(options.content);
  $('body').append('<div class="main-mask" onclick="Geeklab.clearMask()"></div>')
  $modal.addClass('show');
}

Geeklab.showInfoModal = function (infoContent) {
  var $modal = $('#info-modal');
  $modal.find('.content').text(infoContent);
  $('body').append('<div class="main-mask" onclick="Geeklab.clearMask()"></div>')
  $modal.addClass('show');
};

Geeklab.clearMask = function () {
  $('.operate.show').removeClass('show');
  $('body .main-mask').remove();
};
