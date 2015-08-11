$(function () {
  if($('body').hasClass('store') && $('body').hasClass('base_index')) {
    var width = $(window).width(),
        slideWidth = $('#slider-width').width();
    $('#slider').css('width', width);
    $('#slider [u="slides"]').css('width', width);
    var parking = (width - 900) / 2;
    var options = {
        $AutoPlay: false,
        $AutoPlayInterval: 5000, // 自动播放间隔

        $PauseOnHover: 1,                               //[Optional] Whether to pause when mouse over if a slideshow is auto playing, default value is false

        $ArrowKeyNavigation: true,   			            //Allows arrow key to navigate or not
        $SlideWidth: 900,                                   //[Optional] Width of every slide in pixels, the default is width of 'slides' container
        $SlideHeight: 360,                                  //[Optional] Height of every slide in pixels, the default is width of 'slides' container
        $SlideSpacing: parking, 					                //Space between each slide in pixels
        $DisplayPieces: 2,                                  //Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
        $ParkingPosition: parking,                                //The offset position to park slide (this options applys only when slideshow disabled).

        $ArrowNavigatorOptions: {                       //[Optional] Options to specify and enable arrow navigator or not
            $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
            $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
            $AutoCenter: 2,                                 //[Optional] Auto center arrows in parent container, 0 No, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
            $Steps: 1                                       //[Optional] Steps to go for each navigation request, default value is 1
        }
    };

    var jssor_slider1 = new $JssorSlider$("slider", options);


    //responsive code begin
    //you can remove responsive code if you don't want the slider scales while window resizes
    function ScaleSlider() {
      var parentWidth = jssor_slider1.$Elmt.parentNode.clientWidth;
      if (parentWidth){
        jssor_slider1.$ScaleWidth(Math.max(parentWidth, 800));
      } else {
        window.setTimeout(ScaleSlider, 30);
      }
      // 设置arrow位置
      $('#slider [u="arrowleft"]').css('top', 202);
      $('#slider [u="arrowright"]').css('top', 202);
    }
    ScaleSlider();

    $(window).bind("load", ScaleSlider);
    $(window).bind("resize", ScaleSlider);
    $(window).bind("orientationchange", ScaleSlider);
    //responsive code end

    // 商品列表相关
    var $goodUl = $('#good-list > ul');

    function prevPage () {
      if(indexVm.page === 1) {
        return false;
      }
      indexVm.page -= 1;
      indexVm.lastPage = false;
      getGoodPaging(indexVm.page, 'prev');
    }

    function nextPage () {
      if(indexVm.lastPage) {
        return false;
      }
      indexVm.page += 1;
      getGoodPaging(indexVm.page, 'next');
    }

    function getGoodPaging (page, type) {
      var url = '/stores',
          cacheKey = 'page' + page;

      $.ajax({
        url: url,
        dataType: 'json',
        data: {
          page: page,
        }
      })
      .done(function (data) {
        if(data.status === 0 && data.code === 1) {
          if(data.goods.length > 0) {
            // 清除当前页商品
            indexVm.goods = [];
            if(type === 'prev') {
              jssor_slider1.$Prev();
            }
            if(type === 'next') {
              jssor_slider1.$Next();
            }
            // 延迟加载
            setTimeout(function () {
              indexVm.goods = data.goods;
            }, 600);
          } else {
            indexVm.page -= 1;
            indexVm.lastPage = true;
          }
          if(data.goods.length < 8) {
            indexVm.lastPage = true;
          }
        }
      })
      .error(function (errors) {
        console.log(errors);
      });
    }
    function changeGoodListBg (type) {
      if(page % 2 === 0) {
        $goodUl.removeClass('bg-odd').addClass('bg-even');
      } else {
        $goodUl.removeClass('bg-even').addClass('bg-odd');
      }
    }

    var indexVm = new Vue({
      el: '#good-list',
      data: {
        page: 1,
        goods: [],
        lastPage: false
      },
      methods: {
        prevPage: prevPage,
        nextPage: nextPage
      }
    });
    // 获取商品列表第一页
    getGoodPaging(1, null);
  }

});
