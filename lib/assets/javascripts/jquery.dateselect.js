(function($) {
  $.fn.dateSelect = function(settings) {
    if(this.length < 1) {
      return;
    }

    // default settings
    var settings = $.extend({
      startYear: 1950,
      endYear: 2004,
      month: null,
      date: null,
      nodata: null,
      required: true
    }, settings);

    var temp_html = '';

    var $root = this;
    var $year = $root.find('.year');
        $month = $root.find('.month');
        $date = $root.find('.date');

    var year_val = settings.year,
        month_val = settings.month,
        date_val = settings.date;
    var select_prehtml = (settings.required) ? '' : '<option value="">请选择</option>';

    // month
    var monthStart = function () {
      temp_html = select_prehtml;
      for(var i = 1; i <= 12; i++) {
        temp_html += '<option value=' + i + '>' + i + '</option>';
      }
      $month.html(temp_html);
    }
    // date
    var dateStart = function () {
      var year = $year.val();
      var month = $month.val();
      
      // 清空当前的日期
      $date.empty().attr('disabled', true);
      if(year === '' || month === '') {
        if(settings.nodate === 'none') {
          $date.css('display', 'none');
        } else if(settings.nodate === 'hidden') {
          $date.css('visibility', 'hidden');
        }
      }
      // 计算本月长度
      var dates = new Date(year, month, 0).getDate();
      var date_html = select_prehtml;
      for(var i = 1; i <= dates; i++) {
        date_html += '<option value=' + i + '>' + i + '</option>';
      }
      $date.html(date_html).attr('disabled', false).css({'display':'', 'visibility':''});
    }

    var init = function () {
      // 根据设置的年份区间赋值year下拉列表
      temp_html = select_prehtml;
      for(var i = settings.startYear; i <= settings.endYear; i++) {
        temp_html += '<option value=""' + i + '>' + i +'</option>';
      }
      $year.html(temp_html);

      // 设置月份
      monthStart();
      // 选择年份时清空日期
      $year.bind('change', function () {
        $date.empty().attr('disabled', true);
      })
      // 选择月份时发生时间
      $month.bind('change', function () {
        dateStart();
      });
    };

    init();
  };
})(jQuery);
