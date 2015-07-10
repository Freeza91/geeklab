class CreateGoodDetails < ActiveRecord::Migration
  def change
    create_table :good_details do |t|
      t.string :status,   default: "onsell"
      t.string :detail
      t.integer :good_id

      t.timestamps null: false
    end
  end
end
