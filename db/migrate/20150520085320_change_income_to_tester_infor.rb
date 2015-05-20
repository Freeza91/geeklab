class ChangeIncomeToTesterInfor < ActiveRecord::Migration
  def change
    change_column :tester_infors, :income, :string
  end
end
