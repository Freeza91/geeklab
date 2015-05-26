class ChangeDeviceAndRequirementAndPlatformToProject < ActiveRecord::Migration
  def change
    change_column :projects, :platform,     :string
    change_column :projects, :requirement,  :string
    change_column :projects, :device,       :string
  end
end
