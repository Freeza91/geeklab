class Users::IntegralRecordsController < ApplicationController
  def index
    @records = current_user.integral_records.page(params[:page]).per(20)
  end
end
