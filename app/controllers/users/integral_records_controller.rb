class Users::IntegralRecordsController < ApplicationController
  def index
    @records = IntegralRecord.page(params[:page])
  end
end
