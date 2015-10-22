class ChangeCreditsDefaultValueToUser < ActiveRecord::Migration
  def change
    change_column_default :users, :credits, 0
  end
end
