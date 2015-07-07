class AddSkuIdToOrder < ActiveRecord::Migration
  def change
    add_column :orders, :sku_id, :integer
  end
end
