class CreateIntegralRecords < ActiveRecord::Migration
  def change
    create_table :integral_records do |t|
      t.float :cost
      t.string :describe

      t.timestamps null: false
    end
  end
end
