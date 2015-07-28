class Stores::GoodsController < Stores::BaseController

  skip_before_filter :verify_authenticity_token, only: :save_image

  before_filter :authenticate, except: [:index, :show, :save_image, :lookup]

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

    unless current_user
      json['code'], json['msg'] = 1, '需要登录才能继续'
      return render json: json
    end

    good = Good.find_by(id: params[:id])
    if good
      if current_user.to_tester.credits < good.cost
        json['code'], json['msg'] = 2, '积分不足'
      elsif good.stock > 0
        unless good.virtual?
          json['address'] = current_user.addresses.first
        end
      else
        json['code'], json['msg'] = 3, '库存不足'
      end
    end

    render json: json

  end

private

  def good_params
    params.require(:good).permit(:name, :stock, :describle, :cost,
                                 pictures_attributes: [:id, :url, :_destroy])
  end

end
