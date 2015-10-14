module GoodsHelper

  INFO = {
    'on_sell': '立即兑换',
    'off_shelves': '已下架',
    'coming_soon': 'comming soon'
  }

  def get_good_status(available, status)
    if !available
      '被抢光了'
    else

      INFO[status.to_sym]
    end
  end

  def can_exchange(available, status)
    if !available
      'disable'
    else
      class_name = {
        'on_sell': 'exchange',
        'coming_soon': 'highlight',
        'off_shelves': 'disable'
      }
      class_name[status.to_sym]
    end
  end

  def get_assignment_url(user)
    if !current_user
      testers_path
    elsif !user.to_tester.try(:tester_infor)
      new_tester_path
    else
      assignments_path
    end
  end

  def get_name_class(index)
    if index % 4 == 0 || index % 4 == 3
      'name-left'
    else
      'name-right'
    end
  end

  def select_good_status(status)
    str = ''
    flag = status ? false : true

    INFO.each do |hash|
      str += "<option value=#{hash[0]}"
      if hash[0].to_s == status
        str += " selected=selected"
      elsif flag && hash[0].to_s == 'on_sell'
      end
      str += ">#{hash[1]}</option>"
    end

    str.html_safe
  end

  def select_good_label(label)
    str = if !label || label == '0'
      "<option value=1 >实体商品 </option>" +
      "<option value=0 selected=selected >虚拟商品 </option>"
    elsif label == '1'
      "<option value=1 selected=selected >实体商品 </option>" +
      "<option value=0 >虚拟商品 </option>"
    end

    str.html_safe
  end

  def select_good_is_publish(is_publish)
    str = if is_publish
      "<option value=true selected=selected >发布 </option>" +
      "<option value=false >不发布 </option>"
    else
      "<option value=true >发布 </option>" +
      "<option value=false selected=selected >不发布 </option>"
    end

    str.html_safe
  end

  def select_good_is_limit(is_limit)
    str = if is_limit
      "<option value=true selected=selected >受限 </option>" +
      "<option value=false >不受限 </option>"
    else
      "<option value=true >受限 </option>" +
      "<option value=false selected=selected >不受限 </option>"
    end

    str.html_safe
  end

end
