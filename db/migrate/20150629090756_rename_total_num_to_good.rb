class RenameTotalNumToGood < ActiveRecord::Migration
  def change
    rename_column :goods, :total_num, :stock
  end
end
