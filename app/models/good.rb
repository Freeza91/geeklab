class Good < ActiveRecord::Base

  has_many :orders
  has_many :pictures, as: :pictureable
  has_many :skus

  validates :name, presence: true

  scope :show,  -> { where(is_show: true, status: 'on_sell') }

  accepts_nested_attributes_for :pictures, allow_destroy: true

end
