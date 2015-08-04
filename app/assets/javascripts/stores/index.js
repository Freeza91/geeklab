$(function () {
  if($('body').hasClass('store') && $('body').hasClass('base_index')) {
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
    var $goodUl = $('#good-list > ul');

    function prevPage () {
      if(indexVm.page === 1) {
        return false;
      }
      indexVm.page -= 1;
      indexVm.lastPage = false;
      getGoodPaging(indexVm.page);
    }

    function nextPage () {
      if(indexVm.lastPage) {
        return false;
      }
      indexVm.page += 1;
      getGoodPaging(indexVm.page);
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
          if(data.goods.length > 0) {
            indexVm.goods = data.goods;
            changeGoodListBg(page);
          } else {
            indexVm.page -= 1;
            indexVm.lastPage = true;
          }
          if(data.goods.length < 8) {
            indexVm.lastPage = true;
          }
          // 将数据缓存在localStorage
          //localStorage['page' + page] = JSON.stringify(data.goods);
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

  function changeGoodListBg (page) {
    if(page % 2 === 0) {
      $goodUl.removeClass('bg-odd').addClass('bg-even');
    } else {
      $goodUl.removeClass('bg-even').addClass('bg-odd');
    }
  }
});
