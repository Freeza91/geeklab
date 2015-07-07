class CreateSkus < ActiveRecord::Migration
  def change
    create_table :skus do |t|
      t.json :attr
      t.string :status
      t.uuid :uuid
      t.integer :good_id

      t.timestamps null: false
    end
  end
end
