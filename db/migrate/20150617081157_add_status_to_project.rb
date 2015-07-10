class AddStatusToProject < ActiveRecord::Migration
  def change
    add_column :projects, :status, :string, default: 'wait_check'
    remove_column :projects, :approved
  end
end
