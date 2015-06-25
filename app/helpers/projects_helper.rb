module ProjectsHelper
  
  def get_status_info(status)
    info = {
      'underway': '正在进行中',
      'wait_check': '等待审核',
      'checking': '正在审核',
      'not_accept': '审核未通过',
      'success': '任务成功',
      'failed': '任务失败'
    }
    info[status.to_sym]
  end

end
