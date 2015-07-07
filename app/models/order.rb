class Order < ActiveRecord::Base

  belongs_to :good
  belongs_to :user

  validates :good_id, presence: true

  before_create :set_order_id

  def set_order_id
    self.order_id = generate_order_id
  end

  def generate_order_id
    "Order-%.10s" % SecureRandom.uuid
  end

end
