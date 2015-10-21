class AddIndexToRecord < ActiveRecord::Migration
  def change
    add_index :credit_records, [:tester_id, :assignment_id], unique: true
  end
end
