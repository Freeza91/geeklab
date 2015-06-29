class Good < ActiveRecord::Base

  has_many :orders
  has_many :pictures, as: :pictureable

end
