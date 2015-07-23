class Stores::GoodsController < Stores::BaseController

  skip_before_filter :verify_authenticity_token, only: :save_image

  before_filter :authenticate, except: [:index, :show, :save_image]

  def index
    @goods = Good.display.includes(:pictures).page(params[:page]).per(30)
  end

  def show
    @good = Good.publish.includes(:pictures).find_by(id: params[:id])
  end

  def new
    @good = Good.new
    picture = @good.pictures.build
  end

  def save_picture
    json = { status: 0, success: false, msg: '保存成功' }
    file = params[:upload_file]
    picture = Picture.new(url: params[:upload_file])
    if picture.save
      json[:success], json[:file_path] = true, picture.url.url
    else
      json[:msg] = "保存失败，错误信息为: #{picture.errors.full_messages}"
    end

    render json: json
  end

  def create
    json = { status: 0, code: 1, msg: '创建成功' }
    good = Good.new(good_params)
    unless good.save
      json[:code], json[:msg] = 0, "#{good.errors.full_messages}"
    end

    render text: good

    # render json: json
  end

  def edit
    @good = Good.find_by(id: params[:id])
  end

  def update
    json = { status: 0, code: 1, msg: '更新成功' }

    good = Good.find_by(id: params[:id])
    unless good.update_attributes(good_params)
      json[:code], json[:msg] = 0, "#{good.errors.full_messages}"
    end

    render json: json
  end

  def lookup
    json = { status: 0, code: 1, msg: '可以下订单' }

    good = Good.find_by(id: params[:id])
    unless good || good.stock > 0
      json['code'], json['msg'] = 0, '库存不足'
    end

    render json: json

  end

private

  def good_params
    params.require(:good).permit(:name, :stock, :describle, :cost,
                                 pictures_attributes: [:id, :url, :_destroy])
  end

end
