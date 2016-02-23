class AddPublishToReward < ActiveRecord::Migration
  def change
    add_column :rewards, :publish, :boolean, default: false
  end
end
