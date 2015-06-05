class AddCommentToAssignment < ActiveRecord::Migration
  def change
    add_column :assignments, :comment, :string
  end
end
