class SetDefaultAssignTimeToProject < ActiveRecord::Migration
  def change
    change_column :projects, :assign_time, :datetime, default: DateTime.new(2015,3,2)
  end
end
