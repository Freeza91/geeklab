class AddAdditionToSku < ActiveRecord::Migration
  def change
    add_column :skus, :addition, :string
  end
end
