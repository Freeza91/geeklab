class AddPublicToAssignment < ActiveRecord::Migration
  def change
    add_column :assignments, :public, :boolean, default: false
  end
end
