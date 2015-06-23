class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.boolean :target_user
      t.integer :assignment_id
      t.boolean :qualified
    end
  end
end
