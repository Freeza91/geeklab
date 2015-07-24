$(function () {
  if($('body').hasClass('store') && $('body').hasClass('base_index')) {
    var indexVm = new Vue({
      el: '.goods',
      data: {
        page: 1,
        goods: []
      },
      methods: {
        prevPage: prevPage,
        nextPage: nextPage
      }
    });

    function prevPage () {
      indexVm.page--;
      getGoodPagin(indexVm.page);
    }

    function nextPage () {
      indexVm.page++;
      getGoodPagin(indexVm.page);
    }

    function getGoodPaging (page) {
      var url = '/stores',
          cacheKey = 'page' + page;

      // 先检查缓存
      //if(localStorage.hasOwnProperty(cacheKey)) {
        //console.log('fetch data from localStorage');
        //indexVm.goods = JSON.parse(localStorage[cacheKey]);
      //} else {
        //console.log('fetch data from server');
      $.ajax({
        url: url,
        dataType: 'json',
        data: {
          page: page,
        }
      })
      .done(function (data) {
        if(data.status === 0 && data.code === 1) {
          indexVm.goods = data.goods;
          // 将数据缓存在localStorage
          localStorage['page' + page] = JSON.stringify(data.goods);
        }
      })
      .error(function (errors) {
        console.log(errors);
      });
      //}
    }
    // 获取商品列表第一页
    getGoodPaging(1);
  }
});
