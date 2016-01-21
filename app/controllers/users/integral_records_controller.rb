class Users::IntegralRecordsController < ApplicationController

  before_action :require_login?

  def index
    json = { status: 0, code: 1, records: [], pages: 1 }
    case params[:type]
    when 'income'
      @records = current_user.integral_records.earing.page(params[:page]).per(20)
      json[:pages] = current_user.integral_records.earing.size / 20
    when 'cost'
      @records = current_user.integral_records.pay.page(params[:page]).per(20)
      json[:pages] = current_user.integral_records.pay.size / 20
    else
      @records = current_user.integral_records.page(params[:page]).per(20)
    end
    respond_to do |format|
      format.html do
      end
      format.json do
        @records.each do |record|
          json[:records] << record.to_json_for_index
        end
        render json: json
      end
    end
  end

end
