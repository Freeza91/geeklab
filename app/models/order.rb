class Order < ActiveRecord::Base

  default_scope { order('created_at desc') }

  belongs_to :good
  belongs_to :user
  belongs_to :sku
  has_one    :address

  validates :good_id, :sku_id, :user_id, presence: true

  after_create :set_order_id

  def set_order_id
    self.order_id = generate_order_id
    save(validate: false)
  end

  def generate_order_id
    "%.10s" % SecureRandom.uuid
  end

  def virtual?
    label = self.good.label
    return true if label == '充值卡'
    false
  end

end
