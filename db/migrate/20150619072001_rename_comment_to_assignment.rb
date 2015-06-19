class RenameCommentToAssignment < ActiveRecord::Migration
  def change
    rename_column :assignments, :comment, :reasons
  end
end
