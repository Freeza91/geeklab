class ChangeCommentToAssignment < ActiveRecord::Migration
  def change
    #PostgreSQL doesn't know how to automatically convert a column of varchar into an array of varchar.

    remove_column :assignments, :comment
    add_column    :assignments, :comment, :string, array: true

  end
end
