class AddIndexToOrder < ActiveRecord::Migration
  def change
    add_index :orders, :order_id
  end
end
