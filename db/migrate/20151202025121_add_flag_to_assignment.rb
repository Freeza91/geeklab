class AddFlagToAssignment < ActiveRecord::Migration
  def change
    add_column :assignments, :assigned, :boolean, default: false
  end
end
