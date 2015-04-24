class RemoveTimeCreatedAtAndChangeRole < ActiveRecord::Migration
  def change
    remove_column :users, :remember_created_at
    remove_column :users, :confirmed_at
    change_column :users, :role, :string
  end
end
