class AddStatusToAddress < ActiveRecord::Migration
  def change
    add_column :addresses, :status, :string, default: "wait_send"
  end
end
