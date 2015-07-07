class Sku < ActiveRecord::Base

  belongs_to :good

  scope :can_sell,  -> { where('num > ?', 0) }
  before_create :set_uuid
  after_create  :inc_good_stock

  def set_uuid
    self.uuid = SecureRandom.uuid
  end

  def inc_good_stock
    IncGoodStockJob.perform_later(good_id, num)
  end

end
