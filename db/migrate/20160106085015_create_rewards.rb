class CreateRewards < ActiveRecord::Migration
  def change
    create_table :rewards do |t|

      t.string :name
      t.text   :describle
      t.float  :cost

    end
  end
end
