class Address < ActiveRecord::Base

  belongs_to :user
  belongs_to :order

  validates :order_id, presence: true

  def parse_status
    status = {
      'wait_send': '等待发货',
      'sending': '正在配送',
      'send_success': '配送成功'
    }
    status[self.status.to_sym]
  end

end
