class AddReasonsToProject < ActiveRecord::Migration
  def change
    add_column :projects, :reasons, :string, array: true
  end
end
