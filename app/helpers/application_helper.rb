module ApplicationHelper

  def get_qiniu_source(path)
    "http://" + Settings.qiniu_bucket_domain + "/" + path
  end

  def tester_homepage_url(current_user)
    if current_user
      assignments_path
    else
      testers_path
    end
  end

  def pm_homepage_url(current_user)
    if current_user
      projects_path
    else
      pms_path
    end
  end

  def render_footer(controller_name, action_name)
    if controller_name == 'passwords' || controller_name == 'errors'
      return false
    end
    true

  end

  def tester_devices
    ['iPhone', 'iPad', 'Android Phone', 'Android Pad']
  end

  def tester_interests
    ['足球', '健身', '旅游', '二次元', '音乐', '看书', '电影', '星座']
  end

  def tester_personality
    ['温柔', '粗犷', '活泼', '老成', '内向', '开朗', '豪爽', '沉默', '急躁', '稳重']
  end

  def tester_scope
    ['testers', 'assignments', 'rewards', 'reward_records', 'id_cards', 'integral_records']
  end

  def choose_header(controller_name)
    tester = ['testers', 'assignments', 'rewards', 'reward_records', 'id_cards', 'integral_records']
    pm = ['pms', 'projects']
    if tester_scope.include?(controller_name)
      'shared/header_tester'
    elsif pm.include?(controller_name)
      'shared/header_pm'
    end
  end

end
