class Order < ActiveRecord::Base

  default_scope { order('created_at desc') }

  belongs_to :good
  belongs_to :user
  belongs_to :sku
  has_one    :address, dependent: :destroy

  accepts_nested_attributes_for :address, update_only: true

  validates :good_id, :sku_id, :user_id, presence: true

  after_create :set_order_id

  def set_order_id
    self.order_id = generate_order_id
    save(validate: false)
  end

  def generate_order_id
    "%.10s" % SecureRandom.uuid
  end

  def virtual?
    label = self.good.label
    return true if label == '0'
    false
  end

  def to_json
    json = {
      id: self.to_params,
      created_at: created_at.strftime('%F'),
      order_num: order_id,
      virtual: self.virtual?,
      cost: self.good.cost,
      good_id: self.to_params(self.good_id),
      good_name: self.good.name,
      good_pic: self.good.pictures.first.url.try(:url),
      detail: self.get_order_detail
    }
    unless self.virtual?
      json[:express_status] = self.address.parse_status
    end
    json
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
