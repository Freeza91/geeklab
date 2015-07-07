class ChangeStockToGood < ActiveRecord::Migration
  def change
    remove_column :goods, :stock

    add_column :goods, :stock, :integer, default: 0
  end
end
