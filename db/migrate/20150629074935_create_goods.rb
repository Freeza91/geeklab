class CreateGoods < ActiveRecord::Migration
  def change
    create_table :goods do |t|
      t.string :name
      t.string :total_num
      t.text   :describle
      t.float  :cost

      t.timestamps null: false
    end
  end
end
