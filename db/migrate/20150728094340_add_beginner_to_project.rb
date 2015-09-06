class AddBeginnerToProject < ActiveRecord::Migration
  def change
    add_column :projects, :beginner, :boolean, default: false
  end
end
