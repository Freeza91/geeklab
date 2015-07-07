class AddUsedNumToGood < ActiveRecord::Migration
  def change
    add_column :goods, :used_num, :integer, default: 0
  end
end
