class Reward < ActiveRecord::Base

  has_many :orders
  default_scope { order('cost') }
  scope :show,  -> { where(publish: true) }

  validates :name, :amount, :cost, presence: true

end
