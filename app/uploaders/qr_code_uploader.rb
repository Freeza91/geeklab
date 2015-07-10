# encoding: utf-8

class QrCodeUploader < CarrierWave::Uploader::Base

  include CarrierWave::MiniMagick
  storage :qiniu

  self.qiniu_bucket = "#{Settings.qiniu_qrcode_bucket}"
  self.qiniu_bucket_domain = "#{Settings.qiniu_qrcode_domain}"

  def store_dir
    "uploads-#{model.class.to_s.underscore}-#{mounted_as}-#{model.id}"
  end

end
