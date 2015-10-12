class AddRatingFromXxToAssignment < ActiveRecord::Migration
  def change
    add_column :assignments, :rating_from_pm, :integer
    add_column :assignments, :rating_from_admin, :integer

    remove_column :assignments, :rank
  end
end
