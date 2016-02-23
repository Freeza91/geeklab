class AddOrderIdToIntegralRecord < ActiveRecord::Migration
  def change
    add_column :integral_records, :order_id, :integer
  end
end
