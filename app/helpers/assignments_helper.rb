module AssignmentsHelper

  INFO = {
    'wait_check': '等待审核',
    'checking': '正在审核',
    'not_accept': '审核未通过',
    'success': '任务成功',
    'failed': '任务过期'
  }

  def get_status_info(status)
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

end
