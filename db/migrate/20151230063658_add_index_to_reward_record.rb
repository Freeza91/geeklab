class AddIndexToRewardRecord < ActiveRecord::Migration
  def change
    add_index :reward_records, :secret
    add_index :reward_records, :id_num
  end

end