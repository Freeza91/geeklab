class AddLimitToRewardRecord < ActiveRecord::Migration
  def change
    add_column :reward_records, :limit, :boolean, default: false
  end
end
