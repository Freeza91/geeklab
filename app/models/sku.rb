class Sku < ActiveRecord::Base

  include SkuVartualAttr

  belongs_to :good
  has_many   :orders

  scope :can_sell,  -> { where('num > ?', 0) }
  before_create :set_uuid, :inc_good_stock

  validates :good_id, presence: true

  def set_uuid
    self.uuid = SecureRandom.uuid
  end

  def inc_good_stock
    inc_num = num
    IncGoodStockJob.perform_later(good_id, inc_num)
  end

end
