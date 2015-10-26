class Dashboard::BaseController < ApplicationController

  before_action :require_login?
  before_action :is_admin?

  layout "dashboard/layouts/dashboard_application"

  rescue_from CanCan::AccessDenied do |exception|
    render '/errors/access_denied', layout: 'application'
  end

  def index
    render 'dashboard/index'
  end

private

  def is_admin?
    if Rails.env.production?
      unless current_user.admin > 0
        return render text: "你没有权限"
      end
    end
  end

end
