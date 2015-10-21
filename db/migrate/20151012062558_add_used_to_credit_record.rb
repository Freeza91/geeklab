class AddUsedToCreditRecord < ActiveRecord::Migration
  def change
    add_column :credit_records, :used, :boolean, default: false
  end
end
