class RemoveColumnConfirmationTokenToUser < ActiveRecord::Migration
  def change
    remove_column :users, :confirmation_token
    remove_column :users, :confirmation_sent_at
  end
end
