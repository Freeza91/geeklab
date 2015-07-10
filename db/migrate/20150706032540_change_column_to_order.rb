class ChangeColumnToOrder < ActiveRecord::Migration
  def change

    remove_column :orders, :num

    add_column :orders, :order_id, :string
    add_column :orders, :good_url, :string
  end

end


