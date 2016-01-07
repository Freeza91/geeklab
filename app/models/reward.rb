class Reward < ActiveRecord::Base

  has_many :orders

  scope :show,  -> { where(publish: true) }

  validates :name, :cost, presence: true

end
