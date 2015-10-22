$(function () {
  if(!$('body').hasClass('testers_new')) {
    return false;
  }

  var infoVm;

  var cityData = {
    "北京": [
      {value:"北京"}
    ],
    "天津": [
      {value:"天津"}
    ],
    "上海":[
      {value:"上海"}
    ],
    "重庆":[
      {value:"重庆"}
    ],
    "河北": [
      {value: "石家庄"},
      {value: "唐山"},
      {value: "秦皇岛"},
      {value: "邯郸"},
      {value: "邢台"},
      {value: "保定"},
      {value: "张家口"},
      {value: "承德"},
      {value: "沧州"},
      {value: "廊坊"},
      {value: "衡水"}
    ],
    "山西": [
      {value: "太原"},
      {value: "大同"},
      {value: "阳泉"},
      {value: "长治"},
      {value: "晋城"},
      {value: "朔州"},
      {value: "晋中"},
      {value: "运城"},
      {value: "忻州"},
      {value: "临汾"},
      {value: "吕梁"}
    ],
    "内蒙古": [
      {value: "呼和浩特"},
      {value: "包头"},
      {value: "乌海"},
      {value: "赤峰"},
      {value: "通辽"},
      {value: "鄂尔多斯"},
      {value: "呼伦贝尔"},
      {value: "巴彦淖尔"},
      {value: "乌兰察布"},
      {value: "兴安"},
      {value: "锡林郭勒"},
      {value: "阿拉善"}
    ],
    "辽宁": [
      {value: "沈阳"},
      {value: "大连"},
      {value: "鞍山"},
      {value: "抚顺"},
      {value: "本溪"},
      {value: "丹东"},
      {value: "锦州"},
      {value: "营口"},
      {value: "辽阳"},
      {value: "盘锦"},
      {value: "铁岭"},
      {value: "朝阳"},
      {value: "葫芦岛"}
    ],
    "吉林": [
      {value: "长春"},
      {value: "吉林"},
      {value: "四平"},
      {value: "辽源"},
      {value: "通化"},
      {value: "白山"},
      {value: "松原"},
      {value: "白城"},
      {value: "延边"}
    ],
    "黑龙江": [
      {value: "哈尔滨"},
      {value: "齐齐哈尔"},
      {value: "鸡西"},
      {value: "鹤岗"},
      {value: "双鸭山"},
      {value: "大庆"},
      {value: "伊春"},
      {value: "佳木斯"},
      {value: "七台河"},
      {value: "牡丹江"},
      {value: "黑河"},
      {value: "绥化"},
      {value: "大兴安岭"}
    ],
    "江苏": [
      {value: "南京"},
      {value: "无锡"},
      {value: "徐州"},
      {value: "常州"},
      {value: "苏州"},
      {value: "南通"},
      {value: "连云港"},
      {value: "淮安"},
      {value: "盐城"},
      {value: "扬州"},
      {value: "镇江"},
      {value: "泰州"},
      {value: "宿迁"}
    ],
    "浙江": [
      {value: "杭州"},
      {value: "宁波"},
      {value: "温州"},
      {value: "嘉兴"},
      {value: "湖州"},
      {value: "绍兴"},
      {value: "金华"},
      {value: "衢州"},
      {value: "舟山"},
      {value: "台州"},
      {value: "丽水"}
    ],
    "安徽": [
      {value: "合肥"},
      {value: "芜湖"},
      {value: "蚌埠"},
      {value: "淮南"},
      {value: "马鞍山"},
      {value: "淮北"},
      {value: "铜陵"},
      {value: "安庆"},
      {value: "黄山"},
      {value: "滁州"},
      {value: "阜阳"},
      {value: "宿州"},
      {value: "巢湖"},
      {value: "六安"},
      {value: "亳州"},
      {value: "池州"},
      {value: "宣城"}
    ],
    "福建": [
      {value:"福州"},
      {value:"厦门"},
      {value:"莆田"},
      {value:"三明"},
      {value:"泉州"},
      {value:"漳州"},
      {value:"南平"},
      {value:"龙岩"},
      {value:"宁德"}
    ],
    "江西": [
      {value:"南昌"},
      {value:"景德镇"},
      {value:"萍乡"},
      {value:"九江"},
      {value:"新余"},
      {value:"鹰潭"},
      {value:"赣州"},
      {value:"吉安"},
      {value:"宜春"},
      {value:"抚州"},
      {value:"上饶"}
    ],
    "山东": [
      {value:"济南"},
      {value:"青岛"},
      {value:"淄博"},
      {value:"枣庄"},
      {value:"东营"},
      {value:"烟台"},
      {value:"潍坊"},
      {value:"济宁"},
      {value:"泰安"},
      {value:"威海"},
      {value:"日照"},
      {value:"莱芜"},
      {value:"临沂"},
      {value:"德州"},
      {value:"聊城"},
      {value:"滨州"},
      {value:"菏泽"}
    ],
    "河南": [
      {value:"郑州"},
      {value:"开封"},
      {value:"洛阳"},
      {value:"平顶山"},
      {value:"安阳"},
      {value:"鹤壁"},
      {value:"新乡"},
      {value:"焦作"},
      {value:"濮阳"},
      {value:"许昌"},
      {value:"漯河"},
      {value:"三门峡"},
      {value:"南阳"},
      {value:"商丘"},
      {value:"信阳"},
      {value:"周口"},
      {value:"驻马店"},
      {value:"济源"}
    ],
    "湖北": [
      {value:"武汉"},
      {value:"黄石"},
      {value:"十堰"},
      {value:"宜昌"},
      {value:"襄樊"},
      {value:"鄂州"},
      {value:"荆门"},
      {value:"孝感"},
      {value:"荆州"},
      {value:"黄冈"},
      {value:"咸宁"},
      {value:"随州"},
      {value:"恩施"},
      {value:"仙桃"},
      {value:"潜江"},
      {value:"天门"},
      {value:"神农架"}
    ],
    "湖南": [
      {value:"长沙"},
      {value:"株洲"},
      {value:"湘潭"},
      {value:"衡阳"},
      {value:"邵阳"},
      {value:"岳阳"},
      {value:"常德"},
      {value:"张家界"},
      {value:"益阳"},
      {value:"郴州"},
      {value:"永州"},
      {value:"怀化"},
      {value:"娄底"},
      {value:"湘西"}
    ],
    "广东": [
      {value:"广州"},
      {value:"韶关"},
      {value:"深圳"},
      {value:"珠海"},
      {value:"汕头"},
      {value:"佛山"},
      {value:"江门"},
      {value:"湛江"},
      {value:"茂名"},
      {value:"肇庆"},
      {value:"惠州"},
      {value:"梅州"},
      {value:"汕尾"},
      {value:"河源"},
      {value:"阳江"},
      {value:"清远"},
      {value:"东莞"},
      {value:"中山"},
      {value:"潮州"},
      {value:"揭阳"},
      {value:"云浮"}
    ],
    "广西": [
      {value:"南宁"},
      {value: "柳州"},
      {value:"桂林"},
      {value:"梧州"},
      {value:"北海"},
      {value:"防城港"},
      {value:"钦州"},
      {value:"贵港"},
      {value:"玉林"},
      {value:"百色"},
      {value:"贺州"},
      {value:"河池"},
      {value:"来宾"},
      {value:"崇左"}
    ],
    "海南": [
      {value:"海口"},
      {value:"三亚"},
      {value:"五指山"},
      {value:"琼海"},
      {value:"儋州"},
      {value:"文昌"},
      {value:"万宁"},
      {value:"东方"}
    ],
    "四川": [
      {value:"成都"},
      {value:"自贡"},
      {value:"攀枝花"},
      {value:"泸州"},
      {value:"德阳"},
      {value:"绵阳"},
      {value:"广元"},
      {value:"遂宁"},
      {value:"内江"},
      {value:"乐山"},
      {value:"南充"},
      {value:"眉山"},
      {value:"宜宾"},
      {value:"广安"},
      {value:"达川"},
      {value:"雅安"},
      {value:"巴中"},
      {value:"资阳"},
      {value:"阿坝"},
      {value:"甘孜"},
      {value:"凉山"}
    ],
    "贵州": [
      {value:"贵阳"},
      {value:"六盘水"},
      {value:"遵义"},
      {value:"安顺"},
      {value:"铜仁"},
      {value:"黔西南"},
      {value:"毕节"},
      {value:"黔东南"},
      {value:"黔南"}
    ],
    "云南": [
      {value:"昆明"},
      {value:"曲靖"},
      {value:"玉溪"},
      {value:"保山"},
      {value:"昭通"},
      {value:"丽江"},
      {value:"普洱"},
      {value:"临沧"},
      {value:"楚雄"},
      {value:"红河"},
      {value:"文山"},
      {value:"西双版纳"},
      {value:"大理"},
      {value:"德宏"},
      {value:"怒江傈"},
      {value:"迪庆"}
    ],
    "西藏": [
      {value:"拉萨"},
      {value:"昌都"},
      {value:"山南"},
      {value:"日喀则"},
      {value:"那曲"},
      {value:"阿里"},
      {value:"林芝"}
    ],
    "陕西": [
      {value:"西安"},
      {value:"铜川"},
      {value:"宝鸡"},
      {value:"咸阳"},
      {value:"渭南"},
      {value:"延安"},
      {value:"汉中"},
      {value:"榆林"},
      {value:"安康"},
      {value:"商洛"}
    ],
    "甘肃": [
      {value:"兰州"},
      {value:"嘉峪关"},
      {value:"金昌"},
      {value:"白银"},
      {value:"天水"},
      {value:"武威"},
      {value:"张掖"},
      {value:"平凉"},
      {value:"酒泉"},
      {value:"庆阳"},
      {value:"定西"},
      {value:"陇南"},
      {value:"临夏"},
      {value:"甘南"}
    ],
    "青海": [
      {value:"西宁"},
      {value:"海东"},
      {value:"海北"},
      {value:"黄南"},
      {value:"海南"},
      {value:"果洛"},
      {value:"玉树"},
      {value:"梅西"}
    ],
    "宁夏": [
      {value:"银川"},
      {value:"石嘴山"},
      {value:"吴忠"},
      {value:"固原"},
      {value:"中卫"}
    ],
    "新疆": [
      {value:"乌鲁木齐"},
      {value:"克拉玛依"},
      {value:"吐鲁番"},
      {value:"哈密"},
      {value:"昌吉"},
      {value:"博尔塔拉"},
      {value:"巴音郭楞"},
      {value:"阿克苏"},
      {value:"克孜勒苏"},
      {value:"喀什"},
      {value:"和田"},
      {value:"伊犁"},
      {value:"塔城"},
      {value:"阿勒泰"},
      {value:"石河子"},
      {value:"阿拉尔"},
      {value:"图木舒克"},
      {value:"五家渠"}
    ],
    "香港": [
      {value:"中西区"},
      {value:"东区"},
      {value:"九龙城区"},
      {value:"观塘区"},
      {value:"南区"},
      {value:"深水区"},
      {value:"湾仔区"},
      {value:"黄大仙区"},
      {value:"油尖旺区"},
      {value:"离岛区"},
      {value:"葵青区"},
      {value:"北区"},
      {value:"西贡区"},
      {value:"沙田区"},
      {value:"屯门区"},
      {value:"大埔区"},
      {value:"荃湾区"},
      {value:"元朗区"}
    ],
    "澳门": [
      {value:"花地玛堂区"},
      {value:"圣安多尼堂区"},
      {value:"大堂区"},
      {value:"望德堂区"},
      {value:"风顺堂区"},
      {value:"嘉模堂区"},
      {value:"圣方济各堂区"}
    ],
    "台湾": [
      {value:"台北市"},
      {value:"高雄市"},
      {value:"基隆市"},
      {value:"台中市"},
      {value:"台南市"},
      {value:"新竹市"},
      {value:"嘉义市"},
      {value:"台北县"},
      {value:"宜兰县"},
      {value:"新竹县"},
      {value:"桃园县"},
      {value:"苗栗县"},
      {value:"台中县"},
      {value:"彰化县"},
      {value:"南投县"},
      {value:"嘉义县"},
      {value:"云林县"},
      {value:"台南县"},
      {value:"高雄县"},
      {value:"屏东县"},
      {value:"台东县"},
      {value:"花莲县"},
      {value:"澎湖县"}
    ]
  },
  professionLevelOne = [
    {value: '学生'},
    {value: '信息技术'},
    {value: '金融保险'},
    {value: '商业服务'},
    {value: '工程制造'},
    {value: '交通运输'},
    {value: '文化传媒'},
    {value: '娱乐体育'},
    {value: '公共事业'}
  ],
  professionLevelTow = {
    "信息技术": [
      {value: "互联网"},
      {value: "IT"},
      {value: "通讯"},
      {value: "电信运营"},
      {value: "网络游戏"}
    ],
    "金融保险": [
      {value: "投资"},
      {value: "股票/基金"},
      {value: "保险"},
      {value: "银行"},
      {value: "信托保险"}
    ],
    "商业服务": [
      {value: "咨询"},
      {value: "个体运营"},
      {value: "美容美发"},
      {value: "旅游"},
      {value: "酒店餐饮"},
      {value: "休闲娱乐"},
      {value: "贸易"},
      {value: "汽车"},
      {value: "房地产"},
      {value: "物业管理"},
      {value: "装修/装潢"}
    ],
    "工程制造": [
      {value: "建筑"},
      {value: "土木工程"},
      {value: "机械制造"},
      {value: "电子"},
      {value: "生物医药"},
      {value: "食品"},
      {value: "服装"},
      {value: "能源"}
    ],
    "交通运输": [
      {value: "航空"},
      {value: "铁路"},
      {value: "航运/船舶"},
      {value: "公共交通"},
      {value: "物流运输"}
    ],
    "文化传媒": [
      {value: "媒体出版"},
      {value: "设计"},
      {value: "文化传播"},
      {value: "广告创意"},
      {value: "动漫"},
      {value: "公关/会展"},
      {value: "摄影"}
    ],
    "娱乐体育": [
      {value: "影视"},
      {value: "运动体育"},
      {value: "音乐"},
      {value: "模特"}
    ],
    "公共事业": [
      {value: "医疗"},
      {value: "法律"},
      {value: "教育"},
      {value: "政府机关"},
      {value: "科研"},
      {value: "公益"}
    ],
  };

  // init testerInfoVm
  var id = $('#id').attr('value');
  fetchTesterInfo(id, function (testerInfo) {
    initTesterVm(testerInfo);
    initSelect();
  });

  /* select initialization
   * birthday select
   * birthplace select
   * livingplace select
   * profession select
   */
  function initSelect() {
    var $birthYearSelect,
        $birthMonthSelect,
        $birthDateSelect,
        birthYearSelect,
        birthMonthSelect,
        birthDateSelect;

    var defaultDateOption = [],
        initDateOption = [],
        initDates = new Date(infoVm.birthday[0], infoVm.birthday[1], 0).getDate();
    for(var i = 1; i <= 31; i++) {
      defaultDateOption.push({value: i});
    }
    for(var i = 1; i <= initDates; i++) {
      initDateOption.push({value: i});
    }

    $birthYearSelect = $('#birth-year').selectize({
      items: [infoVm.birthday[0]],

      onChange: function (value) {
        infoVm.birthday[0] = $.trim(value);

        birthDateSelect.disable();
        birthDateSelect.clearOptions();
        birthDateSelect.load(function (callback) {
          var  results = defaultDateOption;
          birthDateSelect.enable();
          callback(results);

          birthMonthSelect.addItem(1, false);
          birthDateSelect.addItem(1, false);
        });
      }
    });

    $birthMonthSelect = $('#birth-month').selectize({
      items: [infoVm.birthday[1]],

      onChange: function (value) {
        infoVm.birthday[1] = $.trim(value);

        var year = infoVm.birthday[0],
            month = value;

        birthDateSelect.disable();
        birthDateSelect.clearOptions();
        birthDateSelect.load(function (callback) {
          var dates = new Date(year, month, 0).getDate(),
              results = [];
          for(var i = 1; i <= dates; i++) {
            results.push({value: i});
          }
          birthDateSelect.enable();
          callback(results);
          birthDateSelect.addItem(1, false);
        });
      }
    });

    $birthDateSelect = $('#birth-date').selectize({
      labelField: 'value',
      options: initDateOption,
      items: [infoVm.birthday[2]],

      onChange: function (value) {
        infoVm.birthday[2] = $.trim(value);
        console.log(infoVm.birthday);
      }
    });

    birthYearSelect = $birthYearSelect[0].selectize;
    birthMonthSelect = $birthMonthSelect[0].selectize;
    birthDateSelect = $birthDateSelect[0].selectize;


    var $birthProvSelect,
        $birthCitySelect,
        birthProvSelect,
        birthCitySelect;

    $birthProvSelect = $('#birthplace-prov').selectize({
      items: [infoVm.birthplace[0]],

      onChange: function (value) {
        // 更新model中的数据
        infoVm.birthplace[0] = value;

        // 更新二级类目
        birthCitySelect.disable();
        birthCitySelect.clearOptions();
        birthCitySelect.load(function (callback) {
          var results = cityData[value];
          if (results) {
            birthCitySelect.enable();
            callback(results);
            birthCitySelect.addItem(results[0].value, false);
          } else {
            return false;
          }
        });
      }
    });
    $birthCitySelect = $('#birthplace-city').selectize({
      labelField: 'value',
      options: cityData[infoVm.birthplace[0]],
      items: [infoVm.birthplace[1]],

      onChange: function (value) {
        // 更新model中的数据
        infoVm.birthplace[1] = value;
        console.log(infoVm.birthplace);
      }
    });

    birthProvSelect = $birthProvSelect[0].selectize;
    birthCitySelect = $birthCitySelect[0].selectize;


    var $livingProvSelect,
        $livingCitySelect,
        livingProvSelect,
        livingCitySelect;

    $livingProvSelect = $('#livingplace-prov').selectize({
      items: [infoVm.livingplace[0]],

      onChange: function (value) {
        // 更新model中的数据
        infoVm.livingplace[0] = value;

        // 更新二级类目
        livingCitySelect.disable();
        livingCitySelect.clearOptions();
        livingCitySelect.load(function (callback) {
          var results = cityData[value];
          if (results) {
            livingCitySelect.enable();
            callback(results);
            livingCitySelect.addItem(results[0].value, false);
          } else {
            return false;
          }
        });
      }
    });

    $livingCitySelect = $('#livingplace-city').selectize({
      labelField: 'value',
      options: cityData[infoVm.livingplace[0]],
      items: [infoVm.livingplace[0]],

      onChange: function (value) {
        // 更新model中的数据
        infoVm.livingplace[1] = value;
        console.log(infoVm.livingplace);
      }
    });

    livingProvSelect = $livingProvSelect[0].selectize;
    livingCitySelect = $livingCitySelect[0].selectize;


    var $professionLevelOneSelect,
        $professionLevelTwoSelect,
        professionLevelOneSelect,
        professionLevelTwoSelect;

    $professionLevelOneSelect = $('#profession-level-one').selectize({
      items: [infoVm.profession[0]],

      onChange: function (value) {
        // 更新model中的数据
        infoVm.profession[0] = value;

        // 更新二级类目
        professionLevelTwoSelect.disable();
        professionLevelTwoSelect.clearOptions();
        professionLevelTwoSelect.load(function (callback) {
          var results = professionLevelTow[value];
          if (results) {
            professionLevelTwoSelect.enable();
            callback(results);
            professionLevelTwoSelect.addItem(results[0].value);
          } else {
            return false;
          }
        });
      }
    });

    $professionLevelTwoSelect = $('#profession-level-two').selectize({
      labelField: 'value',
      options: professionLevelTow[infoVm.profession[0]],
      items: [infoVm.profession[1]],

      onChange: function (value) {
        infoVm.profession[1] = value;
      }
    });

    professionLevelOneSelect = $professionLevelOneSelect[0].selectize;
    professionLevelTwoSelect = $professionLevelTwoSelect[0].selectize;
  }

  function fetchTesterInfo (id, callback) {
    $.ajax({
      url: '/testers/' + id,
    }).done(function (data) {
      console.log(data);
      if(data.status === 0 && data.code ===1) {
        callback(data.tester);
      }
    });
  }

  function initTesterVm (testerInfo) {
    var testerInfoDefault = {
      name: '',
      email: '',
      cellphone: '',
      sex: '男',
      birthday: [1980, 1, 1],
      birthplace: ['北京', '北京'],
      livingplace: ['北京', '北京'],
      device: [],
      emotion: '单身',
      orientation: '异性恋',
      education: '本科',
      profession: ['信息技术', '互联网'],
      income: '0-2',
      interest: [],
      hint: {
        email: '',
        cellphone: ''
      },
      error: {
        name: false,
        email: false,
        cellphone: false,
        device: false,
        profession: false
      }
    };

    $.extend(testerInfoDefault, testerInfo);
    console.log(testerInfoDefault);

    infoVm = new Vue({
      el:  '#tester-info',
      data: testerInfoDefault,
      methods: {
        updateDevice: updateDevice,
        updateInterest: updateInterest,
        checkValue: checkValue,
        submit: submit
      }
    });
  }

  function checkValue (vm, event, type) {
    var target = event.target,
        value = target.value,
        name = target.name;
    console.log(value, name);
    if(value && !Geeklab.formValueValid(value, type)) {
      vm.hint[name] = '格式错误';
      vm.error[name] = true;
    }
    return false;
  }

  function generateTesterInfo (vm) {
    var testerInfo = vm.$data,
        data = {};

    data.id = id;
    data.username = testerInfo.name;
    data.email_contract = testerInfo.email;
    data.mobile_phone = testerInfo.cellphone

    data.sex = testerInfo.sex;
    data.birthday = testerInfo.birthday.join('-');;
    data.birthplace = testerInfo.birthplace.join('-');
    data.livingplace = testerInfo.livingplace.join('-');

    data.device = testerInfo.device;
    data.emotional_status = testerInfo.emotion;
    data.sex_orientation = testerInfo.orientation;
    data.education = testerInfo.education;
    if (testerInfo.profession[1]) {
      data.profession = testerInfo.profession.join('-');
    } else {
      data.profession = testerInfo.profession[0];
    }
    data.income = testerInfo.income;
    data.interest = testerInfo.interest;

    return data;
  }

  function checkTesterInfo (vm) {
    var result = true;

    if(!vm.name) {
      vm.error.name = true;
      result = false;
    }

    if(!vm.email) {
      vm.hint.email = '请输入邮箱';
      vm.error.email = true;
      result = false;
    } else {
      if(!Geeklab.formValueValid(vm.email, 'email')) {
        vm.hint.email = '格式错误';
        vm.error.email = true;
        result = false;
      }
    }
    if(!vm.cellphone) {
      vm.hint.cellphone = '请输入手机号';
      vm.error.cellphone = true;
      result = false;
    } else {
      if(!Geeklab.formValueValid(vm.cellphone, 'mobile_phone')) {
        vm.hint.cellphone = '格式错误';
        vm.error.cellphone = true;
        result = false;
      }
    }

    if(vm.device.length === 0) {
      vm.error.device = true;
      result = false;
    }

    return result;
  }

  function postTesterInfo (data, callback) {
    $.ajax({
      url: '/testers/' + id,
      method: 'put',
      data: data
    })
    .done(function (data) {
      if(data.status === 0 && data.code === 1) {
        callback();
      }
    })
    .error(function (errors, status) {
      console.log(errors);
    });

  }

  function updateDevice (vm, event) {
    var target = event.target,
        value = target.value;
    if(vm.error.device) {
      vm.error.device = false;
    }
    if(target.checked) {
      vm.device.push(value);
    } else {
      var index = vm.device.indexOf(value);
      if(index !== -1) {
        vm.device.splice(index, 1);
      }
    }
    console.log(vm.device);
  }

  function updateInterest (vm, event) {
    var target = event.target,
        value = target.value;
    if(target.checked) {
      vm.interest.push(value);
    } else {
      var index = vm.interest.indexOf(value);
      if(index !== -1) {
        vm.interest.splice(index, 1);
      }
    }
    console.log(vm.interest);
  }

  function submit (vm, event) {
    event.preventDefault();
    if(checkTesterInfo(vm)) {
      var testerInfo = generateTesterInfo(vm);
      console.log(testerInfo);
       //loading
      Geeklab.showLoading();
      postTesterInfo(
        testerInfo,
        function () {
          setTimeout(function () {
            Geeklab.removeLoading();
            var $modal = $('#form-finish');
            $('body').append('<div class="main-mask"></div>')
            $modal.addClass('show');
          }, 1500);
        });
    } else {
      return false;
    }
  }


  function updateErrorPosition (newErrorPosition, errorPosition) {
    if (errorPosition) {
      if (newErrorPosition.top < errorPosition.top) {
        return newErrorPosition;
      } else {
        return errorPosition;
      }
    } else {
      return newErrorPosition;
    }
  }

  function scrollToErrorArea (errorPosition) {
    var errorTop = errorPosition.top,
        windowVerticalCenter = $(window).height() / 2;
    if (errorTop < windowVerticalCenter) {
      $(window).scrollTop(0);
    } else {
      $(window).scrollTop(errorTop - windowVerticalCenter);
    }
  }
});
