class AddOrderIdToRewardRecord < ActiveRecord::Migration
  def change
    add_column :reward_records, :order_id, :integer
  end
end
