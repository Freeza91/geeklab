class AddIsTransferAndIsSexyToAssignment < ActiveRecord::Migration
  def change
    add_column :assignments, :is_transfer, :boolean,  default: false
    add_column :assignments, :is_sexy, :boolean,      default: false
  end
end
