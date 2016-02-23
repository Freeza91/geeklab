module RewardRecordsHelper

  INFO = {
    CREATED: '暂未发放',
    SENDING: '发放中',
    SENT: '已发放待领取',
    FAILED: '发放失败',
    RECEIVED: '已领取',
    REFUND: '已退款'
  }

  def dashboard_status(status)
    INFO[status.to_sym] if status
  end


end