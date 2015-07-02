class Good < ActiveRecord::Base

  has_many :orders
  has_many :pictures, as: :pictureable
  has_many :good_details

  accepts_nested_attributes_for :pictures, allow_destroy: true

end
