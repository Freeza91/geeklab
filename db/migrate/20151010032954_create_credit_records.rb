class CreateCreditRecords < ActiveRecord::Migration
  def change
    create_table :credit_records do |t|

      t.integer :project_id
      t.integer :tester_id
      t.integer :assignment_id
      t.integer :credits
      t.integer :bonus_credits
      t.integer :rating
      t.string :rating_type

      t.timestamps null: false
    end
  end
end
