$(function () {
  if(!$('body').hasClass('base_index')) {
    return false;
  }
  var width = $(window).width(),
      slideWidth = $('#slider-width').width();
  $('#slider').css('width', width);
  $('#slider [u="slides"]').css('width', width);
  var parking = (width - slideWidth) / 2;
  var options = {
      $AutoPlay: true,

      $PauseOnHover: 1,                               //[Optional] Whether to pause when mouse over if a slideshow is auto playing, default value is false

      $ArrowKeyNavigation: true,   			            //Allows arrow key to navigate or not
      //$SlideWidth: 900,                                   //[Optional] Width of every slide in pixels, the default is width of 'slides' container
      $SlideWidth: slideWidth,                                   //[Optional] Width of every slide in pixels, the default is width of 'slides' container
      $SlideHeight: 400,                                  //[Optional] Height of every slide in pixels, the default is width of 'slides' container
      $SlideSpacing: 0, 					                //Space between each slide in pixels
      $DisplayPieces: 2,                                  //Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
      //$ParkingPosition: 150,                                The offset position to park slide (this options applys only when slideshow disabled).
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
      console.log(parentWidth);
      if (parentWidth)
          jssor_slider1.$ScaleWidth(Math.max(parentWidth, 800));
      else
          window.setTimeout(ScaleSlider, 30);
  }
  ScaleSlider();

  $(window).bind("load", ScaleSlider);
  $(window).bind("resize", ScaleSlider);
  $(window).bind("orientationchange", ScaleSlider);
  //responsive code end

});
