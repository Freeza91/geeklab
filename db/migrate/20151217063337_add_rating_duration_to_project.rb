class AddRatingDurationToProject < ActiveRecord::Migration
  def change
    add_column :projects, :rating_duration, :float, default: 7 * 24
  end
end
