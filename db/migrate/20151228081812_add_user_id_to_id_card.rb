class AddUserIdToIdCard < ActiveRecord::Migration
  def change
    add_column :id_cards, :user_id, :integer
  end
end
