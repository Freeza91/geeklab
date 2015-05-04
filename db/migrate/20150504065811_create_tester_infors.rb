class CreateTesterInfors < ActiveRecord::Migration
  def change
    create_table :tester_infors do |t|
      t.integer :tester_id

      t.string :username, default: "tester-#{Random.rand 1000}"
      t.string :sex
      t.datetime :birthday
      t.string :birthplace, array: true
      t.string :livingplace, array: true

      t.string :device, array: true
      t.string :emotional_status
      t.string :sex_orientation
      t.string :eduction
      t.string :profession, array: true
      t.float  :income
      t.string :personality, array: true
      t.string :interest, array: true

      t.string :email_contract
      t.string :mobile_phone
      t.string :wechat
      t.string :ali_pay

      t.timestamps null: false
    end
  end
end
