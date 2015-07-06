class Order < ActiveRecord::Base

  belongs_to :good
  belongs_to :user

  validates :total_cost, :good_id, presence: true

end
