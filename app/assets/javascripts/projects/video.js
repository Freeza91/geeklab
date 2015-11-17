$(function () {
  if(!$('body').hasClass('projects_video')) {
    return false;
  }

  var player = $('#video')[0];

  var isRating = $('#is-rating').val();

  //$('.comment-content').on('click', function (event) {
    //var target = event.target;
    //$(this).attr('contentEditable', true);
  //});

  $('.rating-star').on('click', function () {
    if(isRating === 'true' || isRating === true) {
      return false;
    }
    var rating = 5 - $(this).data('rating'),
        projectId = $('#project-id').val(),
        assignmentId = $('#assignment-id').val();
    sendRatingRequest(projectId, assignmentId, rating, function (data) {
      isRating = true;
    });
    console.log(rating);
  });

  function toggleItemBodyContent (event) {
    var $target = $(event.target),
        selector = $target.data('target');
    $target.parents('ul').find('a.active').removeClass('active');
    $target.addClass('active');
    $('.video-info-section.active').hide().removeClass('active');
    $(selector).fadeIn().addClass('active');
  }

  function sendRatingRequest (projectId, assignmentId, rating, callback) {
    var url = '/assignments/' + assignmentId + '/rating';
    $.ajax({
      url: url,
      method: 'post',
      data: {
        project_id: projectId,
        rating: rating
      },
      success: function (data) {
        console.log(data);
        if(data.status === 0 && data.code === 1) {
          callback(data);
        }
      },
      error: function (xhr, textStatus, errors) {
        console.log(data);
      }
    });

  }
  $('[role="tablist"] a').on('click', toggleItemBodyContent);

});
