class AddExpiredAtToAssignment < ActiveRecord::Migration
  def change
    add_column :assignments, :expired_at, :datetime, default: DateTime.new(2015, 3, 2)
  end
end
