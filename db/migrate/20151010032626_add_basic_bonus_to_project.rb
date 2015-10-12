class AddBasicBonusToProject < ActiveRecord::Migration
  def change
    add_column :projects, :basic_bonus, :integer, default: 0
  end
end
