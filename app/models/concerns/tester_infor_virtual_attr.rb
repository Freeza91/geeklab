require 'active_support/concern'

module TesterInforVirtualAttr
  extend ActiveSupport::Concern

  attr_reader :age, :income_arr, :city_level

  def age
    Time.now.year - Date.parse(birthday).year
  end

  def income_low
    income.split('-').first.to_i
  end

  def income_high
    income.split('-').last.to_i
  end

  def income_arr
    (income_low..income_high).to_a
  end

  def city_level
    cities = [
      ['北京-北京', '天津-天津', '广东-广州', '广东-深圳', '上海-上海'],
      ['浙江-杭州', '山东-济南', '江苏-南京', '重庆-重庆', '山东-青岛',
       '辽宁-大连', '浙江-宁波', '福建-厦门', '四川-成都', '湖北-武汉',
       '辽宁-沈阳', '陕西-西安', '吉林-长春', '山东-淄博',  '河北-唐山',
       '湖南-长沙', '福建-福州', '河南-郑州', '河北-石家庄', '江苏-苏州',
       '广东-佛山', '广东-东莞', '江苏-无锡', '山东-烟台', '山西-太原',
       '安徽-合肥', '江西-南昌', '广西-南宁', '云南-昆明', '浙江-温州',
       '黑龙江-哈尔滨'
      ]
    ]
    return 1 if cities[0].include?(livingplaces)
    return 2 if cities[1].include?(livingplaces)
    3
  end

end