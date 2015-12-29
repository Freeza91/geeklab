# encoding: utf-8

class IdCardUploader < CarrierWave::Uploader::Base

  include CarrierWave::MiniMagick
  storage :qiniu

  self.qiniu_bucket = "#{Settings.qiniu_id_card_bucket}"
  self.qiniu_bucket_domain = "#{Settings.qiniu_id_card_domain}"

  def store_dir
    "#{model.id}-" + SecureRandom.uuid
  end

end
