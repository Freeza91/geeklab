module AssignmentsHelper

  INFO = {
    'wait_check': '等待审核',
    'checking': '正在审核',
    'not_accept': '审核未通过',
    'success': '任务成功',
    'failed': '任务过期'
  }

  def get_assignment_status_info(status)
    INFO[status.to_sym]
  end

  def mobile_upload_valid(auth, assignment)
    if auth && assignment.project.expired_at > Time.now
      'valid'
    else
      'invalid'
    end
  end

  def assignment_type(assignment)
    if assignment.project.device == 'web'
      'web'
    else
      'mobile'
    end
  end

  def dashboard_select_status
    INFO.except(:failed).merge({
      success: '审核通过'
    }).collect {|k, v| [v, k]}
  end

  def dashboard_select_rank
    (1..5).to_a.collect{|k| [k, k] }
  end

  def isAssignmentEmpty(assignments)
    if assignments.size == 0
      return 'empty'
    end
  end

  def showBonus(credit_record)
    if credit_record && credit_record.used
      credit_record.bonus_credits * credit_record.rating
    else
      '评分奖励'
    end
  end

  def get_device_iconname(device)
    p device
    icon_name = {
      'iPhone': 'iphone',
      'iPad': 'ipad',
      'Android Phone': 'aphone',
      'Android Pad': 'apad'
    }
    icon_name[device.to_sym]
  end

  def get_interest_iconname(interest)
    p interest
    icon_name = {
      '旅游': 'travel',
      '健身': 'fitness',
      '音乐': 'music',
      '电影': 'movie',
      '二次元': 'comic',
      '看书': 'read',
      '星座': 'sign',
      '足球': 'soccer'
    }
    icon_name[interest.to_sym]
  end

end
