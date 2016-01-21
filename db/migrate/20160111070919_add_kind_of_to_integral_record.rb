class AddKindOfToIntegralRecord < ActiveRecord::Migration
  def change
    add_column :integral_records, :kind_of, :string, default: 'basic'
  end
end
