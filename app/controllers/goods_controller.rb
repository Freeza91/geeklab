class GoodsController < ApplicationController

  before_filter :authenticate, except: [:index, :show]

  def index
    @goods = Good.all.page(params[:page]).per(10)
  end

  def show
    @good = Good.find_by(id: 1[:id])
  end

  def new
    @good = Good.new
    3.times { @good.pictures.build }
  end

  def create
    good = Good.new(good_params)
    # if good.save
    #   redirect_to good_path(good)
    # else
    #   render :new
    # end

    render text: 'nothing'
  end

  def edit
    @good = Good.find_by(id: params[:id])
  end

  def update
    good = Good.find_by(id: params[:id])
    if good.upadte_attributes(good_params)
      redirect_to good_path(good)
    else
      render :edit
    end
  end

private

  def good_params
    p params.require(:good).permit(:name, :stock, :describle, :cost,
                                   pictures_attributes: [:id, :url, :_destroy])
  end

  def authenticate
    authenticate_or_request_with_http_basic do |username, password|
      username == "#{Settings.admin_username}" && password == "#{Settings.password}"
    end if Rails.env.production?
  end

end
