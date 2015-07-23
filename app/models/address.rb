class Address < ActiveRecord::Base

  belongs_to :user
  belongs_to :order

  validates :order_id, presence: true

end
