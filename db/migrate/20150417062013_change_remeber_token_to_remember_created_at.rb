class ChangeRemeberTokenToRememberCreatedAt < ActiveRecord::Migration
  def change
    remove_column :users, :remember_token
    add_column    :users, :remember_created_at, :datetime
  end
end
