class GoodDetail < ActiveRecord::Base

  belongs_to :good

  validates :detail, presence: true
end
