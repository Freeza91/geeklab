class AddEmailToRewardRecord < ActiveRecord::Migration
  def change
    add_column :reward_records, :email, :string
  end
end
