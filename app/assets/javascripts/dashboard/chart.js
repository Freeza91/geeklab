$((function(){

  var days = [], weeks = [], months = [],
      finish_info_num = 0,
      approved_num = 0,
      register_num = 0,
      data = {};

  $.ajax({
    url: '/admin/charts/select',
    dataType: 'json'
  })
  .done(function(data) {
    if(data.code == 1){
      days = data.days;
      weeks = data.weeks;
      months = data.months;
      finish_info_num = data.finish_info_num;
      approved_num = data.approved_num;
      register_num = data.register_num;

      showBasicInfo();

      data = {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [
          {
              label: "My First dataset",
              fillColor: "rgba(220,220,220,0.2)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              datasetStrokeWidth : 2,
              data: ['1', '2', '3', '4', '5']
          }
        ]
      }

      options = {
        // skipLabels: 10
      }

      myNewChart = new Chart($('#chart').get(0).getContext("2d")).Line(data, options);

    }
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

  function showBasicInfo(){
    $('#finish_info').html("完成个人信息数： " + finish_info_num);
    $('#approved').html("成为体验师数： " + approved_num);
    $('#register').html("注册用户数：" + register_num);
  }

  $('.menu .item').tab();

}));