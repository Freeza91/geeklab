class ChangeNumDefaultValueToSkus < ActiveRecord::Migration
  def change
    change_column_default :skus, :num, 1
  end
end
