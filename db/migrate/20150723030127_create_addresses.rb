class CreateAddresses < ActiveRecord::Migration
  def change
    create_table :addresses do |t|
      t.string   :name
      t.string   :tel
      t.string   :location

      t.integer  :user_id
      t.integer  :order_id

      t.timestamps null: false
    end
  end
end
