$(function () {

  $('button[name="login"]').on('click', function (event) {

    event.preventDefault();
    var $this = $(this);
    //if($this.hasClass('disabled')) {
      //return false;
    //}
    var form = $this.data('form');
    var $form = $this.parents('.modal').find(form);
 
    // 获取表单数据
    var data = {};
    data.email = $form.find('[name="email"]').val();
    data.encrypted_password = $form.find('[name="encrypted_password"]').val();
    data.remember_me = $form.find('[name="remember_me"]').is(':checked');
    //data.role = getRole();
 
    var valided = true;
    // 判断邮箱是否为空 && 格式是否正确
    if(data.email === '') {
      $form.find('.form-control-feedback[for="email"]').text('请输入邮箱').parent().addClass('has-error');
      valided = false;
    } else {
      if(!formValid(data.email, 'email')) {
        $form.find('.form-control-feedback[for="email"]').text('格式错误').parent().addClass('has-error');
        valided = false;
      }
    }
    // 判断密码是否为空
    if(data.encrypted_password === '') {
      $form.find('.form-control-feedback[for="password"]').text('请输入密码').removeClass('sr-only').parent().addClass('has-error');
      valided = false;
    }
    // 未通过验证时显示提示
    if(!valided) {
      return false;
    } else {
      // 邮箱与密码均通过检测时隐藏提示信息，发送登录请求
      $form.find('.form-control-feedback').text('').parent().removeClass('has-error');
    }
    // 发送请求
    $.ajax({
      url: '/users/sessions/auth/',
      method: 'post',
      data: data
    })
    .done(function (data, status, xhr) {
      if(data.status === 0) {
        switch(data.code) {
          case 0:
            $form.find('.hint').removeClass('hidden');
            //$form.find('.form-group').removeClass('has-success').find('.glyphicon-ok').addClass('sr-only');
            //$form.find('.form-group').addClass('has-error').find('.glyphicon-remove').removeClass('sr-only');
          break;
          case 1:
            location.href = data.url;
          break;
        }
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });

  });

  $('button[name="regist"]').on('click', function (event) {
    
    event.preventDefault();

    var $this = $(this);
    if($this.hasClass('disabled')) {
      return false;
    }
    var form = $this.data('form');
    var $form = $this.parents('.modal').find(form);
    
    var user = {};
    user.email = $form.find('[name="email"]').val();
    user.code = $form.find('[name="code"]').val();
    user.encrypted_password = $form.find('[name="encrypted_password"]').val();
    user.role = getRole();

    var valided = true;
    // 验证表单所填信息是否完整
    var $email = $form.find('[name="email"]');
    var $pwd = $form.find('[name="encrypted_password"]');
    if(emailValid(user.email, $email)) {
      emailRegisted(user.email, $email, function () {
        if(user.code === '') {
          $form.find('[name="code"]').parent().addClass('has-error').find('.form-control-feedback.text').text('请输入验证码');
          valided = false;
        } else {
          $form.find('[name="code"]').parent().removeClass('has-error').find('.form-control-feedback.text').text('');
        }
        if(!passwordValid(user.encrypted_password, $pwd)) {
          valided = false;
        }
        if(!valided) {
          $form.find('.hint').addClass('hidden');
          return false;
        }
        $.ajax({
          url: '/users/registrations',
          method: 'post',
          data: {user: user}
        })
        .done(function(data, status, xhr) {
          if(data.status === 0) {
            switch(data.code) {
              case 1:
                location.href = '/';
              break;
              case 2:
                $form.find('.hint').text('邮箱已被注册').removeClass('hidden');
              break;
              case 3:
                $form.find('.hint').text('验证码错误或已过期').removeClass('hidden');
              break;
            }
          }  
        })
        .error(function(errors, status) {
          console.log(data); 
        });
      });
    }
  });
  $('input').on('focus', function () {
    $(this).parent().removeClass('has-success has-error').find('.glyphicon').addClass('sr-only');
    $(this).parent().find('.form-control-feedback.text').text('');
  });

  // 关闭modal时清除所有验证状态
  $('.sign .close').on('click', function () {

    // 清楚表单的验证状态
    var $form = $('.sign').find('form');
    $form.find('.form-group').each(function (index, item) {
      var $item = $(item);
      $item.removeClass('has-error has-success');
      $item.find('input').val('');
      $item.find('glyphicon').addClass('sr-only');
      // 清除每个输入框的提示信息
      $item.find('.form-control-feedback').text('');
    });

    // 隐藏提示信息
    $form.find('.hint').addClass('hidden');

    // 将提交按钮置为disabled
    //$form.find('button[type="submit"]').removeClass('btn-blue').addClass('btn-gray disabled');

  });
  // 获取验证码
  $('.get-code').click(function () {

    var $this = $(this);
    if($this.hasClass('disabled')) {
      return false;
    }
    // 获取邮箱
    var email = $('#form-regist').find('[name="email"]').val();
    var $email = $('#form-regist').find('[name="email"]');
    if(!emailValid(email, $email)) {
        return false;
    } else { 
      emailRegisted(email, $email, function () {
        $.ajax({
          url: '/users/mailers/send_confirmation',
          data: {
            email: email
          }
        })
        .done(function (data, status, xhr) {
          // 显示 30s 倒计时
          var count = 30;
          $this.addClass('disabled');
          (function countDown() {
            if(count >= 0) {
              $this.text(count-- + 's后重发');
              setTimeout(countDown, 1000);
            } else {
              $this.text('获取验证码');
              $this.removeClass('disabled');
            }
          })();
        })
        .error(function(errors, status) {
          console.log(errors); 
        });
      });
    }
  });
  
  // 注册邮箱是否可用的检测
  $('[type="email"]').on('blur', function () {

    var $this = $(this);
    var email = $this.val();
    
    if(email === '') {
      return false;
    }
    if($this.parents('form').attr('id') === 'form-regist') {
      emailValid(email, $this) && emailRegisted(email, $this);
    } else {
      emailValid(email, $this);
    }
  });
  $('#form-regist #password').on('blur', function () {
    
    var $this = $(this);
    var password = $this.val();

    if(password === '') {
      return false;
    }
    passwordValid(password, $this);
  });
  function emailValid(email, $el) {
    var $root = $el.parent();
    // 清理目前显示的提示信息
    $root.removeClass('has-success has-error').find('.glyphicon-ok').addClass('sr-only');
    $root.find('.form-control-feedback.text').text('');
    if(email === '') {
      $root.addClass('has-error').find('.form-control-feedback.text').text('请输入邮箱');
      return false;
    }
    if(!formValid(email, 'email')) {
      $root.addClass('has-error').find('.form-control-feedback.text').text('格式错误');
      return false;
    }
    return true;
  }
  function emailRegisted(email, $el, callback) {
    var $root = $el.parent();
      $.ajax({
        url: '/users/registrations/is_emails_exist',
        data: {email: email}
      })
      .done(function (data, status, xhr) {
        if(data.status === 0) {
          switch(data.code) {
            case 0:
              // 可用
              $root.addClass('has-success').find('.glyphicon-ok').removeClass('sr-only');
              if(callback !== undefined) {
                callback();
              }
            break;
            case 1:
              // 不可用，已被注册
              $root.addClass('has-error').find('.form-control-feedback.text').text('邮箱已注册');
              break;
          }
        }
      })
      .error(function (errors, status) {
        console.log(errors);
      });
  }
  function passwordValid(password, $el) {

    var $root = $el.parent();
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
  $('.input-valid').on('blur', function (event) {
    var $this = $(this);
    var $root = $this.parent();
    var $form = $this.parents('form');
    var value = $this.val();
    var type = $this.attr('type');
    if(value.length == 0 || type === 'text') {
      return false;
    }
    var result = formValid(value, type);
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
  // 获取用户角色
  function getRole() {
    var $body = $('body');
    if($body.hasClass('pages_home')) {
      return 'both';
    }
    if($body.hasClass('pages_pm')) {
      return 'pm';
    }
    if($body.hasClass('pages_tester')) {
      return 'tester';
    }
  }

  // form valid
  function formValid (value, type) {
    var result;
    switch(type){
      case 'email':
        var emailReg = /^[0-9a-zA-Z_-]+@([0-9a-zA-Z]+.)+[a-z]$/;
        result = emailReg.test(value);
      break; 
      case 'password':
        var passwordReg = /[0-9a-zA-Z_]{6,16}/;
        result = passwordReg.test(value);
      break;
    }
    return result;
  }

  // enable form submit button
  function enableSubmit ($form) {
    var enable = true;
    $form.find('.form-group').each(function (index, item) {
      if(!$(item).hasClass('has-success') && $(item).find('input').attr('type') !== 'text') {
        enable = false;
      }
    });
    console.log(enable);
    if(enable === true) {
      $form.find('button[type="submit"]').removeClass('disabled btn-gray').addClass('btn-blue');
    } else {
      $form.find('button[type="submit"]').removeClass('btn-blue').addClass('btn-gray disabled');
    }
  }
  
  // 翻转动画触发
  $('.flip-trigger').on('click', function () {
    var $flip = $($(this).data('target'));
    if($flip.hasClass('fliped')) {
      $flip.removeClass('fliped');
    } else {
      $flip.addClass('fliped');
    }
  });

  // 关闭注册modal时移除移除翻转
  $('#signup .close').on('click', function () {
    var $flip = $('#signup .flip');
    if($flip.hasClass('fliped')) {
      $flip.removeClass('fliped');
    }
  });

  // 忘记密码跳转，需要保存当前url至服务器
  //$('.pwd-forget').click(function () {
    //var href= '/users/passwords/reset';
    //var currUrl = location.href;
    //$.ajax({
      //url: href,
      //data: {redirect_path: currUrl}
    //})
    //.done(function (data, status, xhr) {
      //location.href = href;
    //})
    //.error(function (errors, status) {
      //console.log(errors);
    //})
  //});

  $('[name="send-email"]').on('click', function (event) {

    event.preventDefault();
    
    var $this = $(this);
    if($this.hasClass('disabled')) {
      return false;
    }
    var form = $this.data('form');
    var $form = $this.parents(form);

    var data = {};
    data.email = $form.find('[name="email"]').val();
    var $email = $form.find('[name="email"]');

    if(!emailValid(data.email, $email)) {
      return false;
    }
    $.ajax({
      url: '/users/mailers/send_reset_password',
      method: 'post',
      data: data
    })
    .done(function (data, status, xhr) {
      if(data.status === 0) {
        switch(data.code) {
          case 0:
          // 邮箱不存在
            //$form.find('.hint').removeClass('hidden success').find('span').text('该邮箱未注册');
            //$form.find('.link').addClass('hidden');
            $email.parent().addClass('has-error').find('.form-control-feedback.text').text('该邮箱未注册');
          break;
          case 1:
          // 邮件已发送
            $form.find('.hint').removeClass('hidden').addClass('success').find('span').text('邮件已发送');
            if(data.msg !== '') {
              $form.find('.link').attr('href', data.msg).removeClass('hidden');
            } else {
              $form.find('.link').addClass('hidden');
            }
            var count = 60;
            $this.removeClass('btn-blue').addClass('disabled btn-gray');
            function emailCountDown() {
              if(count >= 0) {
                $this.text(count-- + '秒后重新发送邮件');
              } else {
                $this.text('发送邮件').removeClass('disabled btn-gray').addClass('btn-blue');
                $form.find('.hind').addClass('hidden');
              } 
            }
            setInterval(emailCountDown, 1000)
          break;
        }
      }
    })
    .error(function (errors, status) {
      console.log(errors, status);
    });
  });

  $('[name="reset"]').on('click', function (event) {
    
    event.preventDefault();

    var $this = $(this);
    var form = $this.data('form');
    var $form = $this.parents(form);

    if($this.hasClass('disabled')) {
      return false;
    }

    var user = {};
    var $pwd = $form.find('[name="password"]').parent();
    var passwordReg = /[0-9a-zA-Z_]{6,16}/;

    user.encrypted_password = $pwd.find('input').val();
    
    if(user.encrypted_password === '') {
      $pwd.addClass('has-error').find('.form-control-feedback').text('请输入密码');
      return false;
    } else if(!passwordReg.test(user.encrypted_password)) {
      $pwd.addClass('has-error').find('.form-control-feedback').text('格式错误');
      return false;
    } else {
      $pwd.removeClass('has-error').find('.form-control-feedback').text('');
    }
    $.ajax({
      url: '/users/passwords/update_reset',
      method: 'put',
      data: {user: user}
    })
    .done(function(data, status, xhr) {
      $('#form-reset').addClass('hidden');
      $('.info').removeClass('hidden').find('a').attr('href', data.redirect_to);
      var count = 5;
      setInterval(function () {
        if(count >= 0) {
          $('.info').find('.count').text(count--);
        } else {
          location.href = data.redirect_to;
        }  
      }, 1000);
    })
    .error(function(errors, status) {
      
    });
  });
});
