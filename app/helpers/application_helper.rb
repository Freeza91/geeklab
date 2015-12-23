module ApplicationHelper

  def get_qiniu_source(path)
    "http://" + Settings.qiniu_bucket_domain + "/" + path
  end

  def tester_homepage_url(current_user)
    if current_user && current_user.to_tester.approved
      assignments_path
    else
      testers_path
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

end
