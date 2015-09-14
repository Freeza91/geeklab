class AddRankToAssignment < ActiveRecord::Migration
  def change
    add_column :assignments, :rank, :integer, default: 1
  end
end
