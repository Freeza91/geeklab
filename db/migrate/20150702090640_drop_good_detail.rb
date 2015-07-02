class DropGoodDetail < ActiveRecord::Migration
  def change
    drop_table :good_details
  end
end
