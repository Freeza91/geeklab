$(function () {
  if(!$('body').hasClass('testers_new')) {
    return false;
  }
  $('.info-form .submit').on('click', function (event) {
    event.preventDefault();

    var data = {};
    var $form = $('.info-form');
    var $infoSet = $form.find('.form-group');
    $infoSet.each(function(index,item) {
      var $item = $(item)
      var key = $item.find('.info-title').data('name');
      var type = $item.data('type');
      var value = '';
      switch(type){
        case 'text':
          value = $item.find('input').val();
        break;
        case 'radio':
          value = $item.find('input:radio:checked').val();
        break;
        case 'checkbox':
          value = [];
          $checkboxSet = $item.find('input:checkbox:checked');
          $checkboxSet.each(function (index, checkbox) {
            value.push($(checkbox).val());
          });
        break;
        case 'select':
          $selectSet = $item.find('select');
          $selectSet.each(function (index, select) {
            if(index > 0){
              value += '-';
            }
            value += $(select).val();
          });
        break;
      }
      data[key] = value;
    });
    console.log(data);
    $.ajax({
      url: '/testers',
      method: 'post',
      data: data
    })
    .done(function (data, status, xhr) {
      console.log(data);
    })
    .error(function (errors, status) {
      console.log(errors);
    })
  });
});
