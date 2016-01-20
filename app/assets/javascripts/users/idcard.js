$(function () {
  if(!$('body').hasClass('id_cards_edit')) {
    return false;
  }

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

  function checkData (vm) {
    var data = vm.$data,
        error = data.error,
        result = true;
    if(!data.name) {
      erro.name = true;
      result = false;
    }
    if(!data.idnum || !Geeklab.formValueValid(data.idnum, 'idcard')) {
      error.idnum = true;
      result = false;
    }
    if(!data.idcardImageFaceUrl) {
      error.face = true;
      result = false;
    }
    if(!data.idcardImageBackUrl) {
       error.back = true;
      result = false;
    }
    return result;
  }

  function submit (vm, evt) {
    evt.preventDefault();
    if(checkData(vm)) {
      Geeklab.showLoading();
      var data =  new FormData();
      data.append('name', vm.name);
      data.append('id_num', vm.idnum);
      data.append('face', vm.idcardImageFace);
      data.append('back', vm.idcardImageBack);

      $.ajax({
        url: '/users/id_cards',
        method: vm.isEdit ? 'put' : 'post',
        data: data,
        cache: false,
        processData: false, //Dont't process the file
        contentType: false,
        success: function (data) {
          Geeklab.removeLoading();
          if(data.status === 0) {
            switch(data.code) {
              case 1:
                  location.href = '/users/id_cards/show'
              break;
              case 2:
                console.log('保存失败, 请稍后重试');
              break;
              case 3:
                console.log('不能再修改');
              break;
              case 4:
                console.log('还未创建');
                location.reload();
              break;
            }
          }
        },
        error: function (xhr, textStatus, errors) {
          console.log(errors);
        }
      });
    }
  }

  Geeklab.showLoading();
  var isEdit = $('#isEdit').val(),
      idcardVmOpt = {
        el: '#idcard',
        data: {
          name: '',
          idnum: '',
          idcardImageFace: '',
          idcardImageBack: '',
          idcardImageFaceUrl: 'url("http://7xjciz.com2.z0.glb.qiniucdn.com/idcard-image-face.png")',
          idcardImageBackUrl: 'url("http://7xjciz.com2.z0.glb.qiniucdn.com/idcard-image-back.png")',
          imageName: '',
          error: {
            name: false,
            idnum: false,
            face: false,
            back: false
          },
          isEdit: false
        },
        methods: {
          chooseIdcardImage: chooseIdcardImage,
          setIdcardImage: setIdcardImage,
          submit: submit
        }
      },
      idcardVm = {};

  if(isEdit === 'true') {
    // edit, fetch id_card data form server
    $.ajax({
      url: '/users/id_cards/show',
      dataType: 'json',
      success: function (data) {
        idcardVmOpt.data.name = data.id_card.name;
        idcardVmOpt.data.idnum = data.id_card.id_num;
        idcardVmOpt.data.idcardImageFaceUrl = 'url("' + data.id_card.face + '")';
        idcardVmOpt.data.idcardImageBackUrl = 'url("' + data.id_card.back + '")';
        idcardVmOpt.data.isEdit = true;

        idcardVm = new Vue(idcardVmOpt);
        Geeklab.removeLoading();
      },
      error: function (data) {
        console.log(data);
      }
    });
  } else {
    // create, init id_card vm
    idcardVm = new Vue(idcardVmOpt);
    Geeklab.removeLoading();
  }

});
