class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.integer :num
      t.string  :good_name
      t.float   :total_cost
      t.integer :good_id

      t.timestamps null: false
    end
  end
end
