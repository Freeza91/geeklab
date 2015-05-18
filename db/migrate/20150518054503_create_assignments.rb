class CreateAssignments < ActiveRecord::Migration
  def change
    create_table :assignments do |t|
      t.integer :project_id
      t.integer :tester_id
      t.string  :status
      t.string  :video
    end
  end
end
