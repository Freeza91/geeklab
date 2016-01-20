class IdCard < ActiveRecord::Base

  belongs_to :user

  mount_uploader :face, IdCardUploader
  mount_uploader :back, IdCardUploader

  validates :id_num, length: {is: 18}, allow_blank: false

  def secret_id_num
    id_num[-12...-4] = '*' * 8 if id_num.present?
    id_num
  end

  def private_face_url
    secret_url(face.url)
  end

  def private_back_url
    secret_url(back.url)
  end

  def secret_url(url)
    Qiniu::Auth.authorize_download_url(url)
  end

  def to_json
    {
      name: name,
      id_num: id_num,
      face: private_face_url,
      back: private_back_url
    }
  end
end
