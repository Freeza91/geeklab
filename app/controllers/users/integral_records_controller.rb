class Users::IntegralRecordsController < ApplicationController

  before_action :require_login?

  def index
    case params[:type]
    when 'earing'
      @records = current_user.integral_records.earing.page(params[:page]).per(20)
    when 'paying'
      @records = current_user.integral_records.pay.page(params[:page]).per(20)
    else
      @records = current_user.integral_records.page(params[:page]).per(20)
    end
  end

end
