class RenameDurationToExpiredDurationToProject < ActiveRecord::Migration
  def change
    # rename_column can't define default value
    remove_column :projects, :duration
    add_column :projects, :expired_duration, :float, default: 24 * 3
  end
end
