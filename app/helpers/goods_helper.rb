module GoodsHelper
  
  def get_good_status(status)
    info = {
      'on_sell': '立即兑换',
      'off_shelves': '被抢光了',
      'coming_soon': 'comming soon'
    }
    info[status.to_sym]
  end

  def get_assignment_url(user)
    if user.to_tester.try(:tester_infors).blank?
      new_tester_path
    else
      tester_assignments_path(user.id)
    end
  end

  def get_name_class(index) 
    if index % 4 == 0 || index % 4 == 3
      'name-left'
    else
      'name-right'
    end
  end

end
