class AddRewardIdAndTypeToOrder < ActiveRecord::Migration
  def change

    add_column :orders, :reward_id, :integer
    add_column :orders, :type, :string, default: 'good'

  end
end
