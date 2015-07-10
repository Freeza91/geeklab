class PicturesController < ApplicationController

  skip_before_filter :verify_authenticity_token, only: :create

  def create
    json = { status: 0, code: 1, msg: '上传成功', url: '' }

    picture = Picture.new(picture_params)
    if picture.save
      json[:url] = picture.url.url
    else
      json[:code], json[:msg] = 0, '创建失败'
    end

    render json: json

  end

private

  def picture_params
    params.permit(:url).merge({
      pictureable_type: "goods_content"
    })
  end

end
