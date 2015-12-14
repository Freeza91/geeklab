class AddDurationToProject < ActiveRecord::Migration
  def change
    add_column :projects, :duration, :integer, default: 86400
  end
end
