class AddAssignTimeToProject < ActiveRecord::Migration
  def change
    add_column :projects, :assign_time, :datetime, default: Time.now
  end
end
