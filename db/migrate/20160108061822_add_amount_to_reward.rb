class AddAmountToReward < ActiveRecord::Migration
  def change
    add_column :rewards, :amount, :float, default: 1
  end
end
