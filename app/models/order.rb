class Order < ActiveRecord::Base

  default_scope { order('created_at desc') }

  belongs_to :good
  belongs_to :user
  belongs_to :sku

  validates :good_id, :sku_id, :user_id, presence: true

  before_save :set_order_id

  def set_order_id
    self.order_id = generate_order_id
  end

  def generate_order_id
    "%.10s" % SecureRandom.uuid
  end

end
