$(function () {

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
    console.log(data);

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
            $form.find('.hint').removeClass('hidden success').find('span').text('该邮箱未注册');
            $form.find('.link').addClass('hidden');
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
      $('.info').removeClass('hidden');
      console.log(data);
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
