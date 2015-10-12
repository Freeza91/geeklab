class IncGoodStockJob < ActiveJob::Base
  queue_as :inc_good_stock

  def perform(good_id, num)
    good = Good.find_by(id: $hashids.encode(good_id))
    if good
      num = good.stock.to_i + num if good.stock
      good.update_column(:stock, num)
    end
  end
end
