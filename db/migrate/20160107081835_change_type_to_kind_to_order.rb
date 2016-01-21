class ChangeTypeToKindToOrder < ActiveRecord::Migration
  def change
    remove_column :orders, :type
    add_column    :orders, :kind, :string, default: "good"
  end
end
