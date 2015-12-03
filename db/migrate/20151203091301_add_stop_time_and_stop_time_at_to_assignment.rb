class AddStopTimeAndStopTimeAtToAssignment < ActiveRecord::Migration
  def change
    add_column :assignments, :stop_time, :boolean, default: false
    add_column :assignments, :stop_time_at, :datetime
  end
end
