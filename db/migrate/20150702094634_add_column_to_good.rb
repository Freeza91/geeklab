class AddColumnToGood < ActiveRecord::Migration
  def change
    add_column :goods, :status,      :string
    add_column :goods, :is_publish,  :boolean,  default: false
    add_column :goods, :is_limit,    :boolean,  default: false
  end
end
