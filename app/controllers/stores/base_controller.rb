class Stores::BaseController < ApplicationController

  layout 'stores/layouts/stores_application'

  def index
    json = { status: 0, code: 1, goods:[] }

    @goods = Good.display.includes(:pictures).page(params[:page]).per(9)
    @goods.each do |good|
      json[:goods] << good.to_json_with_pictures
    end

    render json: json

  end

  def authenticate
    authenticate_or_request_with_http_basic do |username, password|
      username == "#{Settings.admin_username}" && password == "#{Settings.password}"
    end if Rails.env.production?
  end

end
