class ChangeCollumToTesterInfor < ActiveRecord::Migration
  def change
    change_column :tester_infors, :birthplace, :string
    change_column :tester_infors, :birthday,   :string
    change_column :tester_infors, :profession, :string
    change_column :tester_infors, :livingplace,:string

    rename_column :tester_infors, :eduction,   :education
  end
end
