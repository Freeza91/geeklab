module AddressesHelper

  INFO = {
    'wait_send': '等待发货',
    'sending': '正在配送',
    'send_success': '配送成功'
  }

  def dashboard_address_status(status)
    INFO[status.to_sym]
  end

  def dashboard_address_select_status(status)
    str = ''
    INFO.each do |hash|
      str += "<option value=#{hash[0]}"
      if hash[0].to_s == status
        str += " selected=selected"
      end
      str += ">#{hash[1]}</option>"
    end

    str.html_safe
  end

end