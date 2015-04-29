$(function () {

  $('[name="send-email"]').on('click', function (event) {

    event.preventDefault();
    
    var form = $(this).data('form');
    var $form = $(this).parents(form);

    var data = {};
    data.email = $form.find('[name="email"]').val();
    console.log(data);

    $.ajax({
      url: '/users/mailers/send_reset_password',
      method: 'post',
      data: data
    })
    .done(function (data, status, xhr) {
      console.log(data, status); 
    })
    .error(function (errors, status) {
      console.log(errors, status);
    });
  });

  $('[name="reset"]').on('click', function (event) {
    
    event.preventDefault();

    var form = $(this).data('form');
    var $form = $(this).parents(form);
  });
});
