$(function () {

  $('button[name="login"]').on('click', function () {

    var form = $(this).data('form');
    var $form = $(this).parents('.modal').find(form);
 
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
            console.log(data.msg);
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

  $('button[name="regist"]').on('click', function () {
    
    var form = $(this).data('form');
    var $form = $(this).parents('.modal').find(form);
    
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
    .done(function(status, data, xhr) {

    })
    .error(function(status, errors) {
      
    });
  });

  // 获取验证码
  $('.get-code').click(function () {
    // 获取邮箱
    var email = $('#form-regist').find('[name="email"]').val();
 
    $.ajax({
      url: '/users/mailers/send_confirmation',
      data: {
        email: email
      }
    })
    .done(function (status, data, xhr) {
      console.log(data);
    })
    .error(function(status, errors) {
      console.log(errors); 
    });
  });

  function getRole() {
    var $body = $('body');
    // 获取用户角色
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
});
