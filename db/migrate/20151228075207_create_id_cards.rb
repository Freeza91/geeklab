class CreateIdCards < ActiveRecord::Migration
  def change
    create_table :id_cards do |t|
      t.string :face
      t.string :back
      t.string :id_num
      t.boolean :status, default: false
      t.string :name
    end
  end
end
