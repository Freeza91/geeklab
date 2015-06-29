module ProjectsHelper

  def get_status_info(status)
    info = {
      'underway': '正在进行中',
      'wait_check': '等待审核',
      'checking': '正在审核',
      'not_accept': '审核未通过',
      'success': '正在进行中',
      'failed': '任务失败'
    }
    info[status.to_sym]
  end

  def get_city(level)
    city = [
      '北上广深',
      '省会城市',
      '其它'
    ]
    city[level]
  end

    def get_device(device)
      devices = {
        'phone': '智能手机',
        'tablet': '平板电脑'
      }
      devices[device.to_sym]
    end
end
