class Picture < ActiveRecord::Base

  belongs_to :pictureable, polymorphic: true

  validates :url, presence: true

  mount_uploader :url, PictureUploader

end
