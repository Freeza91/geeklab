class AddIndexToUser < ActiveRecord::Migration
  def change
    add_index :users, :email, unique: true
    add_index :users, :auth_token, unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :remember_token, unique: true
    add_index :users, :confirmation_token, unique: true
  end
end