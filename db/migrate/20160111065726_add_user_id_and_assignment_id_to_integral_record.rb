class AddUserIdAndAssignmentIdToIntegralRecord < ActiveRecord::Migration
  def change
    add_column :integral_records, :user_id, :integer
    add_column :integral_records, :assignment_id, :integer
  end
end
