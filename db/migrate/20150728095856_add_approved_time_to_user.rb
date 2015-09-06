class AddApprovedTimeToUser < ActiveRecord::Migration
  def change
    add_column :users, :approved_time, :datetime, default: Time.now
  end
end
