$(function () {
  if(!$('body').hasClass('id_cards')) {
    return false;
  }

  var idcardVm = new Vue({
    el: '#idcard',
    data: {
      name: '',
      idNum: '',
      idcardImageFace: '',
      idcardImageBack: '',
      idcardImageFaceUrl: 'url("http://7xjciz.com2.z0.glb.qiniucdn.com/idcard-image-face.png")',
      idcardImageBackUrl: 'url("http://7xjciz.com2.z0.glb.qiniucdn.com/idcard-image-back.png")',
      imageName: '',
      error: false
    },
    methods: {
      chooseIdcardImage: chooseIdcardImage,
      setIdcardImage: setIdcardImage,
      submit: submit
    }
  });

  function chooseIdcardImage (vm, imageName) {
    vm.imageName = imageName;
    $('#idcard-image').click();
  }

  function setIdcardImage (vm, evt) {
    var image = evt.target.files[0],
        url = window.URL.createObjectURL(image);
    vm[vm.imageName] = image;
    vm[vm.imageName + 'Url'] = 'url("' + url + '")';
  }

  function checkData (data) {
    if(data.name && data.idNum && data.idcardImageFace && data.idcardImageBack) {
      return true;
    }
    return false;
  }
  function submit (vm, evt) {
    console.log('xxx');
    evt.preventDefault();
    if(checkData(vm.$data)) {
      var data =  new FormData();
      data.append('name', vm.name);
      data.append('id_num', vm.idNum);
      data.append('face', vm.idcardImageFace);
      data.append('back', vm.idcardImageBack);
      $.ajax({
        url: '/users/id_cards',
        method: 'post',
        data: data,
        cache: false,
        processData: false, //Dont't process the file
        contentType: false,
        success: function (data) {
          console.log(data);
          if(data.status === 0 && data.code === 2) {
            console.log('保存失败, 请稍后重试');
          }
        },
        error: function (xhr, textStatus, errors) {
          console.log(errors);
        }
      });
    } else {
      vm.error = true;
    }
  }

});
