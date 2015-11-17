module ApplicationHelper

  def get_qiniu_source(path)
    "http://" + Settings.qiniu_bucket_domain + "/" + path
  end

  def render_footer(controller_name, action_name)
    if controller_name == 'passwords' || controller_name == 'errors'
      return false
    end
    true

  end

  def user_omniauth_authorize_path(provider)
    "/users/authorize/#{provider}/"
  end

end
