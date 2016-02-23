class ChangeDatetimeForStringToRewardRecord < ActiveRecord::Migration
  def change
    change_column :reward_records, :send_time, :string
    change_column :reward_records, :refund_time, :string
  end
end
