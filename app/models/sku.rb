class Sku < ActiveRecord::Base

  belongs_to :good
  has_many   :orders

  scope :can_sell,  -> { where('num > ?', 0) }
  before_create :set_uuid
  after_save    :inc_good_stock

  def set_uuid
    self.uuid = SecureRandom.uuid
  end

  def inc_good_stock
    inc_num = num - num_was.to_i
    IncGoodStockJob.perform_later(good_id, inc_num)
  end

end
