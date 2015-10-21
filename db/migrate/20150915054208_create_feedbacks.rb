class CreateFeedbacks < ActiveRecord::Migration
  def change
    create_table :feedbacks do |t|
      t.string   :timeline
      t.string   :desc
      t.string   :suggestion

      t.integer  :assignment_id

      t.timestamps null: false
    end
  end
end
