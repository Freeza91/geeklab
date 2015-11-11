class IncGoodStockJob < ActiveJob::Base
  queue_as :inc_good_stock

  def perform(good_id, num)
    # Pessimistic Locking
    Good.transaction do
      good = Good.where(id: good_id).lock(true).first
      if good
        num = good.stock.to_i + num if good.stock
        good.update_column(:stock, num)
      end
    end
  end

end
