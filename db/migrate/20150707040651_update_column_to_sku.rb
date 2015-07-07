class UpdateColumnToSku < ActiveRecord::Migration
  def change
    remove_column :skus, :status
    add_column :skus, :num, :integer, default: 0
  end
end


