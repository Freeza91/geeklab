module ApplicationHelper

  def get_qiniu_source(path)
    "http://" + Settings.qiniu_bucket_domain + "/" + path
  end

  def render_footer(controller_name, action_name)
    if controller_name == 'passwords' || controller_name == 'errors'
      return false
    end
    if controller_name == 'testers' && action_name == 'index'
      return false
    end

    true

  end
end
