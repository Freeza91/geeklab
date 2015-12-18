class AddFlagToAssignment < ActiveRecord::Migration
  def change
    add_column :assignments, :flag, :boolean, default: false
  end
end
