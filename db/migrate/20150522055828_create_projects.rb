class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|

      t.string :name
      t.string :profile
      t.string :device, array: true
      t.string :requirement, array: true
      t.string :qr_code
      t.string :platform, array: true
      t.string :desc
      t.datetime :expired_at

      t.string :contact_name
      t.string :phone
      t.string :email
      t.string :company

      t.timestamps null: false
    end
  end
end
