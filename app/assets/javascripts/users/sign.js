$(function () {

  $('button[name="login"]').on('click', function (event) {

    event.preventDefault();
    var $this = $(this);
    if($this.hasClass('disabled')) {
      return false;
    }
    var form = $this.data('form');
    var $form = $this.parents('.modal').find(form);
 
    // 获取表单数据
    var data = {};
    data.email = $form.find('[name="email"]').val();
    data.encrypted_password = $form.find('[name="encrypted_password"]').val();
    data.remember_me = $form.find('[name="remember_me"]').is(':checked');
    data.role = getRole();
 
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
            $form.find('.form-group').removeClass('has-success').find('.glyphicon-ok').addClass('sr-only');
            $form.find('.form-group').addClass('has-error').find('.glyphicon-remove').removeClass('sr-only');
          break;
          case 1:
            console.log(data.msg);
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

    $.ajax({
      url: '/users/registrations',
      method: 'post',
      data: {user: user}
    })
    .done(function(data, status, xhr) {
      if(data.status === 0) {
        switch(data.code) {
          case 1:
          break;
          case 2:
            $form.find('.hind').text('邮箱已被注册').removeClass('hidden');
          break;
          case 3:
            $form.find('hind').text('验证码错误或已过期').removeClass('hidden');
          break;
        }
      }  
    })
    .error(function(errors, status) {
      console.log(data); 
    });
  });

  // 关闭modal时清除所有验证状态
  $('.sign .close').on('click', function () {

    // 清楚表单的验证状态
    var $form = $('.sign').find('form');
    $form.find('.form-group').each(function (index, item) {
      var $item = $(item);
      $item.removeClass('has-success').removeClass('has-error');
      $item.find('input').val('');
      $item.find('.glyphicon').addClass('sr-only');
    });

    // 隐藏提示信息
    $form.find('.hint').addClass('hidden');

    // 将提交按钮置为disabled
    $form.find('button[type="submit"]').removeClass('btn-blue').addClass('btn-gray disabled');

  });
  // 获取验证码
  $('.get-code').click(function () {

    var $this = $(this);
    if($this.hasClass('disabled')) {
      return false;
    }
    // 获取邮箱
    var email = $('#form-regist').find('[name="email"]').val();
    if(email === '') {
      alert('请输入邮箱');
      return false;
    } 
    // TODO 邮箱验证
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
  $('input').on('blur', function (event) {
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
    enableSubmit($form);
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
        result = value.length > 6 || false;
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
});
