class Stores::GoodsController < Stores::BaseController

  before_filter :authenticate, except: [:index, :show]

  def index
    @goods = Good.all.page(params[:page]).per(10)
  end

  def show
    @good = Good.find_by(id: params[:id])
  end

  def new
  end

  def create
    json = { status: 0, code: 1, msg: '创建成功' }

    good = Good.new(good_params)
    unless good.save
      json[:code], json[:msg] = 0, "#{good.errors.full_messages}"
    end

    render json: json
  end

  def edit
    @good = Good.find_by(id: params[:id])
  end

  def update
    json = { status: 0, code: 1, msg: '更新成功' }

    good = Good.find_by(id: params[:id])
    unless good.upadte_attributes(good_params)
      json[:code], json[:msg] = 0, "#{good.errors.full_messages}"
    end

    render json: json
  end

private

  def good_params
    pictures_attributes = {
      "pictures_attributes": JSON.parse(params[:pictures_attributes])
    }
    params.merge!(pictures_attributes)
   params.permit(:name, :stock, :describle, :cost,
                 pictures_attributes: [:id, :url, :_destroy])
  end

  def authenticate
    authenticate_or_request_with_http_basic do |username, password|
      username == "#{Settings.admin_username}" && password == "#{Settings.password}"
    end if Rails.env.production?
  end

end
