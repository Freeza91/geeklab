class Stores::BaseController < ApplicationController

  layout 'stores/layouts/stores_application'

  def index
    render 'stores/index'
  end

  def authenticate
    authenticate_or_request_with_http_basic do |username, password|
      username == "#{Settings.admin_username}" && password == "#{Settings.password}"
    end if Rails.env.production?
  end

end