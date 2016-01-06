class Reward < ActiveRecord::Base

  has_many :orders

  scope :show,  -> { where(publish: true) }

end
