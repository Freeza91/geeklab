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
        'success': '审核通过',
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

  def get_hot_tasks
    [
      '随便用用， 然后聊一下这个应用是什么, 你可以用它来做什么?',
      '使用手机注册一个新用户, 并完善你的个人信息',
      '如果不是测试, 你会长时间使用这个产品吗? 为什么?',
      '你使用过其他类似的产品吗? 你觉得这款产品有什么特别之处吗?',
      '看一下这个应用首屏, 然后说一下你认为这是个什么样的产品',
      '哪件事是你在这个产品中最想去尝试的? 试着做一下',
      '你想购买一个xx, 请快速完成购买的全部流程, 但是不用付费',
      '在使用这个产品的时候你有什么顾虑吗?',
      '刚刚有朋友推荐你使用这个产品, 然后你就像平时那样随便玩玩'
    ]
  end

end
