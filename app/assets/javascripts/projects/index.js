$(function () {
  if(!$('body').hasClass('projects_index')) {
    return false;
  }

  var id,
      $card;
  $('.delete-project').on('click', function () {
    $card = $(this).parents('.card');
    id = $(this).parents('.card').data('projectId');

    var $modal = $('#confirm-modal');
    $modal.data('eventName', 'deleteProject');
    $modal.find('.modal-body .content').text('确认删除任务?');
    $modal.modal();
  });

  $('#confirm-modal #confirm').on('click', function () {
    $('#confirm-modal').modal('hide');
    var url = '/projects/' + id;
    $.ajax({
      url: url,
      method: 'delete'
    })
    .done(function (data, status) {
      if(data.status === 0 && data.code === 1) {
        $card.remove();
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });

  });

});
