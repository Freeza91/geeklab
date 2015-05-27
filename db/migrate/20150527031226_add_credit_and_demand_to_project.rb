class AddCreditAndDemandToProject < ActiveRecord::Migration
  def change
    add_column :projects, :credit, :integer, defalut: 0
    add_column :projects, :demand, :integer, default: 1
  end
end
