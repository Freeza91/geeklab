module GoodsHelper
  
  def get_good_status(available, status)
    if !available
      '被抢光了'
    else
      info = {
        'on_sell': '立即兑换',
        'off_shelves': '已下架',
        'coming_soon': 'comming soon'
      }
      info[status.to_sym]
    end
  end

  def can_exchange(available, status)
    if !available
      'disable'
    else
      class_name = {
        'on_sell': 'exchange',
        'coming_soon': 'highlight no-border',
        'off_shelves': 'disable'
      }
      class_name[status.to_sym]
    end
  end

  def get_assignment_url(user)
    if !current_user
      testers_path
    elsif user.to_tester.try(:tester_infors).blank?
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
