class AddProjectIdToUserFeature < ActiveRecord::Migration
  def change
    add_column :user_features, :project_id, :integer
  end
end
