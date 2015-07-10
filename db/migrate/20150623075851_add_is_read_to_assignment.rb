class AddIsReadToAssignment < ActiveRecord::Migration
  def change
    add_column :assignments, :is_read, :boolean, default: false
  end
end
