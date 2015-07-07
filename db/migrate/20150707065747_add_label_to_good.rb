class AddLabelToGood < ActiveRecord::Migration
  def change
    add_column :goods, :label, :string
  end
end
