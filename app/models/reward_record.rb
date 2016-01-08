class RewardRecord < ActiveRecord::Base

  belongs_to :user
  belongs_to :order

  validates :order_id, :user_id, :id_num, :name, :amount, presence: true

  def limit?
    limit
  end

end
