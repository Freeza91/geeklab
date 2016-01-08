module OrderHelper

  INFO = {
    CREATED: '还未发放'
  }
  def dashboard_order_reward_status(status)
    INFO[status.to_sym] if status
  end

end