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
          break;
          case 1:
          // 邮件已发送
            $form.find('.hint').removeClass('hidden').addClass('success').find('span').text('邮件已发送');
            $form.find('.link').attr('href', data.msg);
            var count = 60;
            $this.removeClass('btn-blue').addClass('disabled btn-gray');
            function emailCountDown() {
              if(count >= 0) {
                $this.text(count-- + '秒后重新发送邮件');
              } else {
                $this.text('发送邮件').removeClass('disabled btn-gray').addClass('btn-blue');
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
    user.encrypted_password = $form.find('[name="password"]').val();
    
    console.log(user);
    $.ajax({
      url: '/users/passwords/update_reset',
      method: 'put',
      data: {user: user}
    })
    .done(function(data, status, xhr) {
      $form.find('.hint').removeClass('hidden');
      var count = 5;
      setInterval(function () {
        if(count >= 0) {
          $form.find('span').text(count--);
        } else {
          location.href = '/';
        }  
      }, 1000);
    })
    .error(function(errors, status) {
      
    });
  });
});
