class Good < ActiveRecord::Base

  has_many :orders
  has_mang :pictures, as: :pictureable

end
