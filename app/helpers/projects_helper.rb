module ProjectsHelper

  def get_project_status_info(status)
    #if demand == video_size
      #'任务成功'
    #else
    info = {
        'underway': '正在进行中',
        'wait_check': '等待审核',
        'checking': '正在审核',
        'not_accept': '审核未通过',
        'success': '正在进行中',
        'failed': '任务失败',
        'finish': '任务成功',
        'delete': '任务被产品经理删除'
    }
    info[status.to_sym]
  end

  def get_city(city_level)
    city = [
      '北上广深',
      '省会城市',
      '其它'
    ]
    cities = ''
    city_level.each_with_index do |level, index|
      if index != 0
        cities += ', '
      end
      cities += city[level-1]
    end
    cities
  end

  def parse_platform(platform)
    platforms = {
      'ios': 'iOS',
      'android': 'Android'
    }
    platforms[platform.to_sym]
  end

  def get_device(device)
    devices = {
      'phone': '智能手机',
      'pad': '平板电脑'
    }
    devices[device.to_sym]
  end

end
