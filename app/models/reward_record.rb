class RewardRecord < ActiveRecord::Base

  default_scope { order('id desc') }

  belongs_to :user
  belongs_to :order

  validates :order_id, :user_id, :id_num, :name, :amount, presence: true

  scope :used, -> { where(status: 'SENT') }
  scope :unuse, -> { where(status: 'CREATED') }

  def limit?
    limit
  end

  def to_json_for_index
    {
      id: to_params,
      created_at: created_at.strftime('%F %T'),
      order_id: order.order_id,
      amount: amount.to_i
    }
  end

  def self.to_csv(options = {})
    CSV.generate(options) do |csv|
      csv << ["金额", "邮箱", "姓名", "身份证号"]
      all.each do |record|
        csv << [
          record.amount,
          record.email || record.user.email,
          record.name,
          record.id_num
        ]
      end
    end
  end

end