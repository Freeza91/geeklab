class Stores::GoodsController < Stores::BaseController

  skip_before_filter :verify_authenticity_token, only: :save_image

  before_filter :authenticate, except: [:index, :show]
  # layout false, except: [:index, :show]

  def index
    @goods = Good.all.page(params[:page]).per(10)
  end

  def show
    @good = Good.find_by(id: params[:id])
  end

  def new
    @good = Good.new
    picture = @good.pictures.build
  end

  def save_image
    file = params[:upload_file]
    p file
    render json: {
        success: true,
        file_path: "http://7xjl4d.com2.z0.glb.qiniucdn.com/uploads-picture-url-10%2F33.jpg"
      }
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

private

  def good_params
    # pictures_attributes = {
    #   "pictures_attributes": JSON.parse(params[:pictures_attributes])
    # }
    # params.merge!(pictures_attributes)
   p params.require(:good).permit(:name, :stock, :describle, :cost,
                                  pictures_attributes: [:id, :url, :_destroy])
  end

end
