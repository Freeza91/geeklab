class Good < ActiveRecord::Base

  has_many :orders
  has_many :pictures, as: :pictureable

  accepts_nested_attributes_for :pictures, allow_destroy: true

end
