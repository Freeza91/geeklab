class AddTimestampsToAssginment < ActiveRecord::Migration
  def change

    change_table :assignments do |t|
      t.timestamps
    end

  end
end
