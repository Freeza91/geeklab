class AddLastViewTimeToUser < ActiveRecord::Migration
  def change
    add_column :users, :last_view_time, :datetime, default: Time.now
  end
end
