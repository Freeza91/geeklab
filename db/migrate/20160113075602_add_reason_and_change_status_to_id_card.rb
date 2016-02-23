class AddReasonAndChangeStatusToIdCard < ActiveRecord::Migration
  def change
    add_column :id_cards, :reason, :string

    remove_column :id_cards, :status
    add_column    :id_cards, :status, :string, default: 'wait_check'
  end

end
