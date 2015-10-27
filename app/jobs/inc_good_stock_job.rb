class IncGoodStockJob < ActiveJob::Base
  queue_as :inc_good_stock

  def perform(good_id, num)
    goods = Good.find_by_sql ["select * from goods where id = ? for update", good_id]
    if goods && good = goods.first
      num = good.stock.to_i + num if good.stock
      good.update_column(:stock, num)
    end
  end
end
