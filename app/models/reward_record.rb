class RewardRecord < ActiveRecord::Base

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
      order_id: order_id,
      amount: amount.to_i
    }
  end

end
