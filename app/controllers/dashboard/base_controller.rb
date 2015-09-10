class Dashboard::BaseController < ApplicationController

  before_action :require_login?
  before_action :is_admin?

  layout "dashboard/layouts/dashboard_application"

  def index
    render 'dashboard/index'
  end

private

  def is_admin?
    unless current_user.admin > 0
      # return render text: "你没有权限"
    end
  end

end
