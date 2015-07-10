class IncGoodStockJob < ActiveJob::Base
  queue_as :inc_good_stock

  def perform(good_id, num)
    good = Good.find_by(id: good_id)
    if good
      good.update_column(:stock, good.stock.to_i + num)
    end
  end
end
