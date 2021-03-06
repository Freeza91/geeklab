class Stores::BaseController < ApplicationController

  layout 'stores/layouts/stores_application'

  def index

    respond_to do |format|
      format.html { render '/stores/index' }
      format.json do
        json = { status: 0, code: 1, goods:[] }

        @goods = Good.display.includes(:pictures).page(params[:page]).per(8)
        @goods.each do |good|
          json[:goods] << good.to_json_with_pictures
        end

        render json: json
      end
    end

  end

  def help
    render '/stores/help'
  end

  def authenticate
    authenticate_or_request_with_http_basic do |username, password|
      username == "#{Settings.admin_username}" && password == "#{Settings.admin_password}"
    end if Rails.env.production?
  end

end
