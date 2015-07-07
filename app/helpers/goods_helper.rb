module GoodsHelper
  
  def get_status_info(status)
    info = {
      'on_sell': '立即兑换',
      'off_shelves': '被抢光了',
      'coming_soon': 'comming soon'
    }
    info[status]
  end

end
