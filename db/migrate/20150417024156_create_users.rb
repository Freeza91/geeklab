class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string   :username
      t.string   :email,                  default: "", null: false
      t.string   :encrypted_password,     default: "", null: false
      t.boolean  :approved,               default: false
      t.integer  :role,                   default: :tester

      t.string   :auth_token

      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      t.string :remember_token

      t.string   :confirmation_token
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at

      t.timestamps
    end
  end
end
