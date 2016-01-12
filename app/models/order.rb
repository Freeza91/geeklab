class Order < ActiveRecord::Base

  default_scope { order('created_at desc') }

  belongs_to :good
  belongs_to :user
  belongs_to :sku
  belongs_to :reward
  has_one    :address, dependent: :destroy
  has_one    :reward_record, dependent: :destroy
  has_one    :integral_record, dependent: :destroy

  accepts_nested_attributes_for :address, update_only: true

  validates :user_id, presence: true # sku_id, good_id is't necessary for reward

  include ::Callbacks::Order
  include ::Jsons::Order

  def virtual?
    label = self.good.label
    return true if label == '0'
    false
  end

  def get_order_detail
    detail = {}
    if self.virtual?
      msg = Sku.find_by(id: $hashids.encode(self.sku.try(:id))).try(:addition).split('&')
      detail[:卡号] = msg[0]
      detail[:密码] = msg[1]
    else
      msg = self.address.try(:addition)
      if msg
        msg = msg.split('&')
        detail[:物流公司] = msg[0]
        detail[:快递单号] = msg[1]
      else
        detail[:物流公司] = '暂无'
        detail[:快递单号] = '暂无'
      end
    end
    detail
  end

end
