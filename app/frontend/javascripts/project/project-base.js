var projectBase = module.exports = {};

projectBase.transformSex = function (sex) {
  var sexMap = {
    '男': 'male',
    '女': 'female'
  };
  return sexMap[sex];
};

projectBase.getVmCheckboxArr = function (vmArr, valueType) {
  valueType = valueType || 'value';
  var result = [];
  switch(valueType) {
    case 'index':
      vmArr.forEach(function (item, index) {
        if(item.checked) {
          result.push(index + 1);
        }
      });
    break;
    case 'value':
      vmArr.forEach(function (item) {
        if(item.checked) {
          result.push(item.key);
        }
      });
    break;
  }
  return result;
};

projectBase.localImageView = function (vm, event) {
  var input = event.target,
      qrcode = input.files[0];
  vm.qrcode = qrcode;
  var url = window.URL.createObjectURL(qrcode);
  input.value = '';
  $('.qrcode-preview img').attr('src', url);
};

projectBase.previousStep = function (vm, event) {
  event.preventDefault();
  scrollToTop(0, 0);
  vm.step--;
  return false;
};

// task oprate function
projectBase.isTaskFilled = function (task) {
  return task.content.length > 0
};

projectBase.addTask = function (vm, taskContent, event) {
  event.preventDefault();
  if(vm.tasks.length < 8) {
    vm.tasks.push({
      content: taskContent || ''
    }); } else {
    vm.tasksLimited = true;
  }
};

projectBase.deleteTask = function (vm, task, event) {
  event.preventDefault();
  vm.tasks.$remove(task.$index);
};

projectBase.addHotTask = function (vm, event) {
  event.preventDefault();
  var taskContent = event.target.innerText;
  projectBase.addTask(vm, taskContent, event);
};

projectBase.showHotTask = function (vm, event) {
  event.preventDefault();
  if(!vm.showHotTasks) {
    vm.showHotTasks = true;
  }
};

// checkbox operate function
projectBase.toggleCheckAll = function (vm, category) {
  var checkbox = vm[category];
  if(vm.checkAll[category]) {
    checkbox.forEach(function (item) {
      item.checked = true;
    });
  } else {
    checkbox.forEach(function (item) {
      item.checked = false;
    });
  }
};

projectBase.checkAllEffect = function (vm, category, currChecked) {
  if(!currChecked) {
    vm.checkAll[category] = false;
  } else {
    var checkbox = vm[category];
    if(checkbox.every(projectBase.isCheck)) {
      vm.checkAll[category] = true;
    }
  }
};

projectBase.isCheck = function (item) {
  return item.checked;
};

// textarea length limit
projectBase.textareaLengthLimit = function (vm, modelName, lengthLimit, event) {
  var el = event.target;
  var value = el.value;
  var len = value.length;
  if(len < lengthLimit) {
    return true;
  } else {
    if(modelName === 'situation') {
      vm.situation = value.substr(0, lengthLimit);
    } else {
      vm.tasks[modelName].content = value.substr(0, lengthLimit);
    }
    event.returnValue = false;
  }
};


function scrollToTop (topPoint, duration) {
  if(duration === 0) {
    $('html, body').scrollTop(0);
  } else {
    $('html, body').animate({
      scrollTop: topPoint,
    }, duration || 800);
  }
}
projectBase.scrollToTop = scrollToTop;
