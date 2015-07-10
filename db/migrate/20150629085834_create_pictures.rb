class CreatePictures < ActiveRecord::Migration
  def change
    create_table :pictures do |t|
      t.integer :pictureable_id
      t.string  :pictureable_type
      t.string  :url

      t.timestamps null: false
    end
  end
end
